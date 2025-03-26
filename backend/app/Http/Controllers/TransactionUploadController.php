<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class TransactionUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate(['file' => 'required|mimes:pdf|max:5120']);

        $file = $request->file('file');
        $path = $file->store('temp');
        $localPath = storage_path("app/{$path}");

        $response = Http::attach('file', file_get_contents($localPath), $file->getClientOriginalName())
            ->post('http://localhost:5000/extract');

        Storage::delete($path);

        $data = $response->json();
        $transactions = $data['transactions'] ?? [];

        $savedTransactions = [];
        foreach ($transactions as $tx) {
            // Convert date string to Carbon instance
            $date = Carbon::createFromFormat('d M Y', $tx['date']);

            // Create the transaction
            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'date' => $date,
                'card_number' => $tx['card_number'] ?? '',
                'type' => $tx['type'] ?? '',
                'details' => $tx['details'] ?? '',
                'amount' => $this->parseAmount($tx['amount']),
                'category' => null, // We'll add categorization later
                'vendor' => null, // We'll add vendor extraction later
                'is_recurring' => false // We'll add recurring detection later
            ]);

            $savedTransactions[] = $transaction;
        }

        return response()->json([
            'message' => 'Transactions imported successfully',
            'count' => count($savedTransactions)
        ]);
    }

    private function parseAmount($amount)
    {
        // Remove 'R' and any spaces, then convert to float
        $cleanAmount = str_replace(['R', ' '], '', $amount);
        return (float) str_replace(',', '', $cleanAmount);
    }
}