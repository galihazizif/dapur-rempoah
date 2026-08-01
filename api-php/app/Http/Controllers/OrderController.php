<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Voucher;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    private const STORE_COORDS = ['lat' => -7.394778, 'lng' => 109.344413];

    private function haversineDistance($lat1, $lon1, $lat2, $lon2)
    {
        $r = 6371; // Earth radius in km
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat/2) * sin($dLat/2) +
             cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
             sin($dLon/2) * sin($dLon/2);
        $c = 2 * atan2(sqrt($a), sqrt(1-$a));
        return $r * $c;
    }

    private function generateFriendlyId($prefix, $length = 6)
    {
        $chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomPart = '';
        for ($i = 0; $i < $length; $i++) {
            $randomPart .= $chars[rand(0, strlen($chars) - 1)];
        }
        return "{$prefix}{$randomPart}";
    }

    private function sendTelegramNotification($order)
    {
        $token = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_CHAT_ID');

        if (!$token || !$chatId) {
            return;
        }

        $itemsText = "";
        foreach ($order->items as $item) {
            $itemsText .= "• {$item->product_name} x{$item->quantity} (Rp " . number_format($item->price, 0, ',', '.') . ")\n";
        }

        $text = "<b>📦 Pesanan Baru!</b>\n\n" .
                "🆔 ID: #{$order->id}\n" .
                "👤 Pelanggan: {$order->customer_name}\n" .
                "📞 WhatsApp: {$order->customer_phone}\n" .
                "🚚 Tipe: {$order->order_type}\n";

        if ($order->pickup_delivery_date) {
            $text .= "📅 Tanggal: {$order->pickup_delivery_date}\n";
        }
        if ($order->pickup_delivery_time) {
            $text .= "⏰ Waktu: {$order->pickup_delivery_time}\n";
        }
        if ($order->order_type === 'delivery') {
            $text .= "📍 Alamat: {$order->customer_address}\n";
            if ($order->shipping_fee > 0) {
                $text .= "🚚 Ongkos Kirim: Rp " . number_format($order->shipping_fee, 0, ',', '.') . "\n";
            }
        }

        $text .= "\n<b>📋 Detail Item:</b>\n{$itemsText}\n" .
                 "💰 Total: <b>Rp " . number_format($order->total_amount, 0, ',', '.') . "</b>\n\n" .
                 "<a href=\"https://rempoah.my.id/orders/{$order->hash}\">Kelola Pesanan</a>";

        try {
            Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => 'HTML'
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to send Telegram notification: " . $e->getMessage());
        }
    }

    // POST /orders
    public function store(Request $request)
    {
        $request->validate([
            'customer' => 'required|array',
            'customer.name' => 'required|string',
            'customer.phone' => 'required|string',
            'customer.address' => 'required|string',
            'customer.order_type' => 'nullable|string',
            'customer.pickup_delivery_date' => 'nullable|string',
            'customer.pickup_delivery_time' => 'nullable|string',
            'customer.latitude' => 'nullable',
            'customer.longitude' => 'nullable',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'turnstileToken' => 'required|string',
            'voucherCode' => 'nullable|string'
        ]);

        $customer = $request->customer;
        $orderType = $customer['order_type'] ?? 'delivery';
        $latitude = $customer['latitude'] ?? null;
        $longitude = $customer['longitude'] ?? null;

        // 1. Verify Turnstile Token
        $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'secret' => env('TURNSTILE_SECRET_KEY'),
            'response' => $request->turnstileToken,
            'remoteip' => $request->ip()
        ]);

        if (!$response->json('success')) {
            Log::error("Turnstile validation failed: ", $response->json());
            return response()->json([
                'success' => false,
                'message' => 'Bot protection verification failed',
                'errorDetails' => $response->json('error-codes')
            ], 403);
        }

        // 2. Check if store is open
        $storeStatus = Setting::where('key', 'store_status')->value('value');
        if ($storeStatus !== 'open') {
            return response()->json([
                'success' => false,
                'message' => 'Maaf, toko sedang tutup dan tidak menerima pesanan.'
            ], 403);
        }

        // 3. Validate items and calculate total
        $items = $request->items;
        $productIds = collect($items)->pluck('id')->toArray();
        $dbProducts = Product::whereIn('id', $productIds)->get();

        $calculatedTotal = 0;
        $verifiedItems = [];

        foreach ($items as $item) {
            $menuProduct = $dbProducts->firstWhere('id', $item['id']);
            if (!$menuProduct) {
                return response()->json([
                    'success' => false,
                    'message' => "Product with ID {$item['id']} not found"
                ], 400);
            }
            if (!$menuProduct->available) {
                return response()->json([
                    'success' => false,
                    'message' => "Product {$menuProduct->name} is currently unavailable"
                ], 400);
            }

            $price = $menuProduct->price;
            $quantity = intval($item['quantity']);
            $calculatedTotal += $price * $quantity;

            $verifiedItems[] = [
                'product_id' => $menuProduct->id,
                'product_name' => $menuProduct->name,
                'price' => $price,
                'quantity' => $quantity
            ];
        }

        // 4. Voucher Code validation
        $discountAmount = 0;
        $appliedVoucher = null;
        $voucherCode = $request->voucherCode;

        if ($voucherCode) {
            $voucher = Voucher::where('code', strtoupper(trim($voucherCode)))->first();
            if (!$voucher) {
                return response()->json(['success' => false, 'message' => 'Voucher tidak ditemukan'], 400);
            }
            if (!$voucher->is_active) {
                return response()->json(['success' => false, 'message' => 'Voucher sudah tidak aktif'], 400);
            }
            if ($voucher->is_used) {
                return response()->json(['success' => false, 'message' => 'Voucher sudah digunakan'], 400);
            }
            $appliedVoucher = $voucher;
            $discountAmount = $voucher->amount;
        }

        // 5. Shipping Fee Calculation
        $shippingFeeAmount = 0;
        if ($orderType === 'delivery') {
            if (!$latitude || !$longitude) {
                return response()->json([
                    'success' => false,
                    'message' => 'Titik koordinat lokasi pengiriman wajib dipilih untuk metode pesan antar.'
                ], 400);
            }

            $distance = $this->haversineDistance(
                self::STORE_COORDS['lat'],
                self::STORE_COORDS['lng'],
                floatval($latitude),
                floatval($longitude)
            );

            if ($distance > 10) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lokasi pengiriman terlalu jauh (maksimal 10 km).'
                ], 400);
            }

            // Enforce minimum shipping fee of 1,000 IDR
            $shippingFeeAmount = max(1000, round($distance * 1000));
        }

        $calculatedTotal = $calculatedTotal - $discountAmount + $shippingFeeAmount;
        if ($calculatedTotal < 0) {
            $calculatedTotal = 0;
        }

        // 6. DB operations via transaction
        $orderId = $this->generateFriendlyId('ORD');
        $orderHash = Str::random(10);

        try {
            DB::transaction(function () use ($orderId, $orderHash, $customer, $calculatedTotal, $orderType, $voucherCode, $discountAmount, $shippingFeeAmount, $appliedVoucher, $verifiedItems) {
                $order = Order::create([
                    'id' => $orderId,
                    'hash' => $orderHash,
                    'customer_name' => $customer['name'],
                    'customer_phone' => $customer['phone'],
                    'customer_address' => $customer['address'],
                    'total_amount' => $calculatedTotal,
                    'status' => 'pending',
                    'payment_method' => 'qris',
                    'payment_status' => 'unpaid',
                    'voucher_code' => $voucherCode ? strtoupper(trim($voucherCode)) : null,
                    'discount_amount' => $discountAmount,
                    'shipping_fee' => $shippingFeeAmount,
                    'additional_fee' => 0,
                    'order_type' => $orderType,
                    'pickup_delivery_date' => $customer['pickup_delivery_date'] ?? null,
                    'pickup_delivery_time' => $customer['pickup_delivery_time'] ?? null
                ]);

                if ($appliedVoucher) {
                    $appliedVoucher->update(['is_used' => true]);
                }

                foreach ($verifiedItems as $item) {
                    OrderItem::create([
                        'order_id' => $orderId,
                        'product_id' => $item['product_id'],
                        'product_name' => $item['product_name'],
                        'price' => $item['price'],
                        'quantity' => $item['quantity']
                    ]);
                }
            });
        } catch (\Exception $e) {
            Log::error("Failed to save order: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to process order. ' . $e->getMessage()
            ], 500);
        }

        // 7. Send Telegram Notification (Async / Queue in real projects, dispatch here)
        $savedOrder = Order::with('items')->find($orderId);
        $this->sendTelegramNotification($savedOrder);

        return response()->json([
            'success' => true,
            'message' => 'Order placed successfully',
            'orderId' => $orderId,
            'hash' => $orderHash,
            'total' => $calculatedTotal,
            'shippingFee' => $shippingFeeAmount
        ], 201);
    }

    // GET /orders/{hash}
    public function show($hash)
    {
        $order = Order::with('items')->where('hash', $hash)->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'order' => $order,
            'items' => $order->items
        ]);
    }

    // GET /admin/orders
    public function adminIndex()
    {
        $orders = Order::orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    // PUT /admin/orders/{id}
    public function adminUpdate(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        try {
            DB::transaction(function () use ($request, $order) {
                // If items array is provided, process items update first
                if ($request->has('items') && is_array($request->items)) {
                    // Delete old items
                    OrderItem::where('order_id', $order->id)->delete();

                    // Re-calculate base total
                    $itemsBaseTotal = 0;
                    $items = $request->items;
                    $productIds = collect($items)->pluck('product_id')->toArray();
                    $dbProducts = Product::whereIn('id', $productIds)->get();

                    foreach ($items as $item) {
                        $menuProduct = $dbProducts->firstWhere('id', $item['product_id']);
                        if (!$menuProduct) {
                            throw new \Exception("Product with ID {$item['product_id']} not found");
                        }

                        $quantity = intval($item['quantity']);
                        if ($quantity <= 0) {
                            throw new \Exception("Invalid quantity for product {$menuProduct->name}");
                        }

                        $itemsBaseTotal += $menuProduct->price * $quantity;

                        OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $menuProduct->id,
                            'product_name' => $menuProduct->name,
                            'price' => $menuProduct->price,
                            'quantity' => $quantity
                        ]);
                    }
                } else {
                    // Use existing items total
                    $itemsBaseTotal = OrderItem::where('order_id', $order->id)
                        ->select(DB::raw('SUM(price * quantity) as total'))
                        ->value('total') ?? 0;
                }

                $newShipping = $request->has('shipping_fee') ? intval($request->shipping_fee) : ($order->shipping_fee ?? 0);
                $newAdditional = $request->has('additional_fee') ? intval($request->additional_fee) : ($order->additional_fee ?? 0);

                $calculatedTotal = $itemsBaseTotal - ($order->discount_amount ?? 0) + $newShipping + $newAdditional;
                if ($calculatedTotal < 0) {
                    $calculatedTotal = 0;
                }

                // Update order details
                $data = [
                    'shipping_fee' => $newShipping,
                    'additional_fee' => $newAdditional,
                    'total_amount' => $calculatedTotal
                ];

                if ($request->has('status')) {
                    $data['status'] = $request->status;
                }
                if ($request->has('payment_status')) {
                    $data['payment_status'] = $request->payment_status;
                }

                $order->update($data);
            });

            return response()->json([
                'success' => true,
                'message' => 'Order updated'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
