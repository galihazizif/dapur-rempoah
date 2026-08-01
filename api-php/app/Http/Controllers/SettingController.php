<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    // GET /settings
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    // PUT /admin/settings
    public function adminUpdate(Request $request)
    {
        if ($request->has('store_status')) {
            Setting::updateOrCreate(
                ['key' => 'store_status'],
                ['value' => $request->store_status]
            );
        }

        if ($request->has('store_message')) {
            Setting::updateOrCreate(
                ['key' => 'store_message'],
                ['value' => $request->store_message]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings updated'
        ]);
    }
}
