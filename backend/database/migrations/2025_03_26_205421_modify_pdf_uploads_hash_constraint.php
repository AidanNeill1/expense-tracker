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
        Schema::table('pdf_uploads', function (Blueprint $table) {
            // Drop the existing unique constraint on hash
            $table->dropUnique(['hash']);

            // Add a new composite unique constraint on hash and user_id
            $table->unique(['hash', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pdf_uploads', function (Blueprint $table) {
            // Drop the composite unique constraint
            $table->dropUnique(['hash', 'user_id']);

            // Restore the original unique constraint on hash
            $table->unique(['hash']);
        });
    }
};
