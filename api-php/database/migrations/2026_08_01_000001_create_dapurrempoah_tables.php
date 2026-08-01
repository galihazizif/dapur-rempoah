<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('hash')->unique();
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->text('customer_address');
            $table->integer('total_amount');
            $table->string('status')->default('pending');
            $table->string('payment_method')->default('qris');
            $table->string('payment_status')->default('unpaid');
            $table->string('voucher_code')->nullable();
            $table->integer('discount_amount')->default(0);
            $table->integer('shipping_fee')->default(0);
            $table->integer('additional_fee')->default(0);
            $table->string('order_type')->default('delivery');
            $table->string('pickup_delivery_date')->nullable();
            $table->string('pickup_delivery_time')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('vouchers', function (Blueprint $table) {
            $table->string('code')->primary();
            $table->integer('amount');
            $table->boolean('is_active')->default(true);
            $table->boolean('is_used')->default(false);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->text('value');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->integer('price');
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('available')->default(true);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->string('order_id');
            $table->integer('product_id');
            $table->string('product_name');
            $table->integer('price');
            $table->integer('quantity');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });

        Schema::create('payment_confirmations', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->string('order_id');
            $table->string('order_reference');
            $table->integer('amount_paid');
            $table->text('notes')->nullable();
            $table->integer('status')->default(0); // 1 processed, 0 unprocessed
            $table->dateTime('payment_date');
            $table->string('validity')->nullable(); // null, invalid, valid
            $table->string('image_url')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_confirmations');
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('products');
        Schema::dropIfExists('settings');
        Schema::dropIfExists('vouchers');
        Schema::dropIfExists('orders');
    }
};
