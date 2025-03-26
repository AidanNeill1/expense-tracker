<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = auth()->user()->transactions()
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($transactions);
    }
}
