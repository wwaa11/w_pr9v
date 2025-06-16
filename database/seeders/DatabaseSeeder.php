<?php
namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'user_id' => '1',
            'name'    => 'Test User',
            'role'    => 'witness',
        ]);

        User::create([
            'user_id' => '2',
            'name'    => 'Test User',
            'role'    => 'witness',
        ]);

    }
}
