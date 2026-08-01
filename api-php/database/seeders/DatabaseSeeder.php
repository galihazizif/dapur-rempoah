<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Default settings
        DB::table('settings')->insertOrIgnore([
            [
                'key' => 'store_status',
                'value' => 'open',
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'key' => 'store_message',
                'value' => 'Maaf, toko sedang libur. Silakan pesan dilain waktu.',
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);

        // Default products
        DB::table('products')->insert([
            [
                'name' => 'Ayam Rempah Jelantah',
                'category' => 'makanan',
                'price' => 25000,
                'description' => 'Ayam goreng rempah khas Rempoah dengan bumbu rahasia yang meresap.',
                'image_url' => 'https://images.unsplash.com/photo-1562607311-54bc72273617?q=80&w=400&h=300&auto=format&fit=crop',
                'available' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Nasi Goreng Rempoah',
                'category' => 'makanan',
                'price' => 22000,
                'description' => 'Nasi goreng dengan aroma rempah yang kuat dan telur mata sapi.',
                'image_url' => 'https://images.unsplash.com/photo-1512058560366-cd2429ff5c7c?q=80&w=400&h=300&auto=format&fit=crop',
                'available' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Es Teh Manis Rempah',
                'category' => 'minuman',
                'price' => 8000,
                'description' => 'Teh manis segar dengan sentuhan kayu manis dan cengkeh.',
                'image_url' => 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=400&h=300&auto=format&fit=crop',
                'available' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Kopi Susu Gula Aren',
                'category' => 'minuman',
                'price' => 18000,
                'description' => 'Kopi susu creamy dengan pemanis gula aren alami.',
                'image_url' => 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&h=300&auto=format&fit=crop',
                'available' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Tempe Mendoan',
                'category' => 'camilan',
                'price' => 12000,
                'description' => 'Tempe goreng tepung khas Banyumas, disajikan hangat dengan sambal kecap.',
                'image_url' => 'https://images.unsplash.com/photo-1626002061266-9e6b4f728fa5?q=80&w=400&h=300&auto=format&fit=crop',
                'available' => true,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'name' => 'Pisang Goreng Madu',
                'category' => 'camilan',
                'price' => 15000,
                'description' => 'Pisang goreng manis dengan karamelisasi madu yang legit.',
                'image_url' => 'https://images.unsplash.com/photo-1634818462211-373909786638?q=80&w=400&h=300&auto=format&fit=crop',
                'available' => false,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
