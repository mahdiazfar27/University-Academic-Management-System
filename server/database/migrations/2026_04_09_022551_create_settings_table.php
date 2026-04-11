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
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->longText('value')->nullable();
        });

        // Insert default settings
        DB::table('settings')->insert([
            ['key' => 'institution_name', 'value' => 'Royal Academica'],
            ['key' => 'tagline', 'value' => 'Excellence in Educational Management'],
            ['key' => 'logo_url', 'value' => null],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
