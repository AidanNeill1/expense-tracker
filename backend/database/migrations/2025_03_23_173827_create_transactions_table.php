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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
        
            $table->date('date');                      // Transaction date
            $table->string('card_number');             // Masked or last 4 digits
            $table->string('type');                    // e.g., 'debit', 'credit'
            $table->text('details');                   // Merchant, notes, etc.
            $table->decimal('amount', 10, 2);          // Transaction amount
            $table->string('category')->nullable();    // Optional: groceries, rent, etc.
            $table->string('vendor')->nullable();      // Extracted merchant name
            $table->boolean('is_recurring')->default(false); // Recurring payment flag
        
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
