<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // GET /menu
    public function menu()
    {
        $products = Product::where('available', true)->get();
        return response()->json($products);
    }

    // GET /products
    public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->get();
        return response()->json($products);
    }

    // POST /admin/products (via POST /products)
    public function adminStore(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'category' => 'required|string',
            'price' => 'required|integer',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
            'available' => 'nullable'
        ]);

        $imageUrl = $request->image_url ?? '';

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'product-' . Str::uuid() . '-' . $file->getClientOriginalName();
            
            // Ensure public/product-images exists
            if (!file_exists(public_path('product-images'))) {
                mkdir(public_path('product-images'), 0755, true);
            }
            
            $file->move(public_path('product-images'), $filename);
            $imageUrl = '/product-images/' . $filename;
        }

        $available = true;
        if ($request->has('available')) {
            $available = filter_var($request->available, FILTER_VALIDATE_BOOLEAN);
        }

        $product = Product::create([
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'description' => $request->description ?? '',
            'image_url' => $imageUrl,
            'available' => $available
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product created',
            'id' => $product->id
        ], 201);
    }

    // PUT /admin/products/{id} (via PUT /products/{id})
    public function adminUpdate(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $data = [];
        if ($request->has('name')) $data['name'] = $request->name;
        if ($request->has('category')) $data['category'] = $request->category;
        if ($request->has('price')) $data['price'] = $request->price;
        if ($request->has('description')) $data['description'] = $request->description;
        if ($request->has('image_url')) $data['image_url'] = $request->image_url;

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'product-' . Str::uuid() . '-' . $file->getClientOriginalName();
            
            // Ensure public/product-images exists
            if (!file_exists(public_path('product-images'))) {
                mkdir(public_path('product-images'), 0755, true);
            }
            
            $file->move(public_path('product-images'), $filename);
            $data['image_url'] = '/product-images/' . $filename;
        }

        if ($request->has('available')) {
            $data['available'] = filter_var($request->available, FILTER_VALIDATE_BOOLEAN);
        }

        $product->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Product updated'
        ]);
    }

    // DELETE /admin/products/{id} (via DELETE /products/{id})
    public function adminDestroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found'
            ], 404);
        }

        $product->delete();

        return response()->json([
            'success' => true,
            'message' => 'Product deleted'
        ]);
    }
}
