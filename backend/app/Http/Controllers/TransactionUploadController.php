<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;
use App\Models\PdfUpload;
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

        // Calculate file hash to prevent duplicates
        $hash = md5_file($localPath);

        // Check for duplicate upload
        if (PdfUpload::where('hash', $hash)->exists()) {
            Storage::delete($path);
            return response()->json([
                'message' => 'This statement has already been uploaded',
                'error' => 'duplicate_statement'
            ], 400);
        }

        $response = Http::attach('file', file_get_contents($localPath), $file->getClientOriginalName())
            ->post('http://pdf-extractor:5000/extract');

        Storage::delete($path);

        $data = $response->json();
        $transactions = $data['transactions'] ?? [];

        if (empty($transactions)) {
            return response()->json([
                'message' => 'No transactions found in PDF',
                'error' => 'no_transactions'
            ], 422);
        }

        // Create PDF upload record
        $pdfUpload = PdfUpload::create([
            'user_id' => auth()->id(),
            'filename' => $file->getClientOriginalName(),
            'hash' => $hash,
            'transaction_count' => count($transactions),
            'metadata' => [
                'extracted_at' => now()->toIso8601String(),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType()
            ]
        ]);

        $dates = [];
        $savedTransactions = [];
        foreach ($transactions as $tx) {
            // Convert date string to Carbon instance
            $date = Carbon::createFromFormat('d M Y', $tx['date']);
            $dates[] = $date;

            // Create the transaction
            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'pdf_upload_id' => $pdfUpload->id,
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

        // Update PDF upload with statement date range
        if (!empty($dates)) {
            $pdfUpload->update([
                'statement_start_date' => min($dates),
                'statement_end_date' => max($dates)
            ]);
        }

        return response()->json([
            'message' => 'Transactions imported successfully',
            'pdf_upload_id' => $pdfUpload->id,
            'transaction_count' => count($savedTransactions),
            'statement_start_date' => $pdfUpload->statement_start_date,
            'statement_end_date' => $pdfUpload->statement_end_date
        ]);
    }

    private function parseAmount($amount)
    {
        // Remove 'R' and any spaces, then convert to float
        $cleanAmount = str_replace(['R', ' '], '', $amount);
        return (float) str_replace(',', '', $cleanAmount);
    }
}
