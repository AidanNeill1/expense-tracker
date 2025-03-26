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
        Schema::create('pdf_uploads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('filename');                    // Original filename
            $table->string('hash')->unique();             // MD5 hash of file to prevent duplicates
            $table->integer('transaction_count');         // Number of transactions extracted
            $table->date('statement_start_date')->nullable(); // Optional: First transaction date
            $table->date('statement_end_date')->nullable();   // Optional: Last transaction date
            $table->json('metadata')->nullable();         // Any additional metadata
            $table->timestamps();
        });

        // Add pdf_upload_id to transactions table
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreignId('pdf_upload_id')->nullable()->constrained()->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign(['pdf_upload_id']);
            $table->dropColumn('pdf_upload_id');
        });

        Schema::dropIfExists('pdf_uploads');
    }
};
