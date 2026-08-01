<?php

namespace App\Http\Controllers;

use App\Models\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    // GET /admin/vouchers
    public function adminIndex()
    {
        $vouchers = Voucher::orderBy('created_at', 'desc')->get();
        return response()->json($vouchers);
    }

    // POST /admin/vouchers
    public function adminStore(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'amount' => 'required|integer',
            'is_active' => 'boolean'
        ]);

        $code = strtoupper(trim($request->code));

        if (Voucher::where('code', $code)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher code already exists'
            ], 400);
        }

        $voucher = Voucher::create([
            'code' => $code,
            'amount' => $request->amount,
            'is_active' => $request->has('is_active') ? $request->is_active : true,
            'is_used' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Voucher created'
        ], 201);
    }

    // PUT /admin/vouchers/{code}
    public function adminUpdate(Request $request, $code)
    {
        $voucher = Voucher::where('code', $code)->first();
        if (!$voucher) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher not found'
            ], 404);
        }

        $data = [];
        if ($request->has('amount')) {
            $data['amount'] = $request->amount;
        }
        if ($request->has('is_active')) {
            $data['is_active'] = $request->is_active;
        }
        if ($request->has('is_used')) {
            $data['is_used'] = $request->is_used;
        }

        $voucher->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Voucher updated'
        ]);
    }

    // DELETE /admin/vouchers/{code}
    public function adminDestroy($code)
    {
        $voucher = Voucher::where('code', $code)->first();
        if (!$voucher) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher not found'
            ], 404);
        }

        $voucher->delete();

        return response()->json([
            'success' => true,
            'message' => 'Voucher deleted'
        ]);
    }

    // GET /vouchers/{code}
    public function show($code)
    {
        $voucher = Voucher::where('code', strtoupper(trim($code)))->first();

        if (!$voucher) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher tidak ditemukan'
            ], 404);
        }

        if (!$voucher->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher sudah tidak aktif'
            ], 400);
        }

        if ($voucher->is_used) {
            return response()->json([
                'success' => false,
                'message' => 'Voucher sudah digunakan'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'voucher' => $voucher
        ]);
    }
}
