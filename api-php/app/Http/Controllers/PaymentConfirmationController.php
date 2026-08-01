<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\PaymentConfirmation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentConfirmationController extends Controller
{
    private function generateFriendlyId($prefix, $length = 6)
    {
        $chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomPart = '';
        for ($i = 0; $i < $length; $i++) {
            $randomPart .= $chars[rand(0, strlen($chars) - 1)];
        }
        return "{$prefix}{$randomPart}";
    }

    private function sendTelegramNotification($orderReference, $amountPaid, $notes, $paymentDate)
    {
        $token = env('TELEGRAM_BOT_TOKEN');
        $chatId = env('TELEGRAM_CHAT_ID');

        if (!$token || !$chatId) {
            return;
        }

        $formattedAmount = number_format(intval($amountPaid), 0, ',', '.');
        $formattedNotes = $notes ?: '-';

        $text = "<b>💸 Konfirmasi Pembayaran!</b>\n\n" .
                "🆔 Referensi: #{$orderReference}\n" .
                "💰 Jumlah: <b>Rp {$formattedAmount}</b>\n" .
                "📝 Catatan: {$formattedNotes}\n" .
                "📅 Tanggal: {$paymentDate}\n\n" .
                "<a href=\"https://dapurrempoah.com/admin/payments\">Lihat Pembayaran</a>";

        try {
            Http::post("https://api.telegram.org/bot{$token}/sendMessage", [
                'chat_id' => $chatId,
                'text' => $text,
                'parse_mode' => 'HTML'
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to send Telegram confirmation notification: " . $e->getMessage());
        }
    }

    // POST /payment-confirmations
    public function store(Request $request)
    {
        $request->validate([
            'order_reference' => 'required|string',
            'amount_paid' => 'required|integer',
            'payment_date' => 'required|string',
            'turnstileToken' => 'required|string',
            'notes' => 'nullable|string',
            'image' => 'nullable|file|max:1024' // max:1024 is 1MB in Laravel validation (kilobytes)
        ]);

        // 1. Turnstile verification
        $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
            'secret' => env('TURNSTILE_SECRET_KEY'),
            'response' => $request->turnstileToken,
            'remoteip' => $request->ip()
        ]);

        if (!$response->json('success')) {
            Log::error("Payment confirmation Turnstile validation failed: ", $response->json());
            return response()->json([
                'success' => false,
                'message' => 'Bot protection verification failed'
            ], 403);
        }

        // 2. Find order by id or hash
        $orderReference = $request->order_reference;
        $order = Order::where('id', $orderReference)
            ->orWhere('hash', $orderReference)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // 3. Handle proof image upload
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'proof-' . Str::uuid() . '-' . $file->getClientOriginalName();
            
            // Ensure public/payment-proofs exists
            if (!file_exists(public_path('payment-proofs'))) {
                mkdir(public_path('payment-proofs'), 0755, true);
            }
            
            $file->move(public_path('payment-proofs'), $filename);
            $imageUrl = '/payment-proofs/' . $filename;
        }

        // 4. Save confirmation and update order status
        $id = $this->generateFriendlyId('PMT');
        try {
            DB::transaction(function () use ($id, $order, $orderReference, $request, $imageUrl) {
                PaymentConfirmation::create([
                    'id' => $id,
                    'order_id' => $order->id,
                    'order_reference' => $orderReference,
                    'amount_paid' => $request->amount_paid,
                    'notes' => $request->notes ?? '',
                    'payment_date' => $request->payment_date,
                    'status' => 0,
                    'image_url' => $imageUrl
                ]);

                $order->update(['payment_status' => 'confirmation']);
            });
        } catch (\Exception $e) {
            Log::error("Failed to confirm payment: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to save confirmation: ' . $e->getMessage()
            ], 500);
        }

        // 5. Send Telegram Notification
        $this->sendTelegramNotification(
            $orderReference,
            $request->amount_paid,
            $request->notes,
            $request->payment_date
        );

        return response()->json([
            'success' => true,
            'message' => 'Konfirmasi pembayaran berhasil dikirim',
            'id' => $id
        ], 201);
    }

    // GET /admin/payment-confirmations
    public function adminIndex()
    {
        $confirmations = PaymentConfirmation::orderBy('created_at', 'desc')->get();
        return response()->json($confirmations);
    }

    // PUT /admin/payment-confirmations/{id}
    public function adminUpdate(Request $request, $id)
    {
        $confirmation = PaymentConfirmation::find($id);

        if (!$confirmation) {
            return response()->json([
                'success' => false,
                'message' => 'Payment confirmation not found'
            ], 404);
        }

        $data = [];
        if ($request->has('status')) {
            $data['status'] = $request->status;
        }
        if ($request->has('validity')) {
            $data['validity'] = $request->validity;
        }

        $confirmation->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Payment confirmation updated'
        ]);
    }
}
