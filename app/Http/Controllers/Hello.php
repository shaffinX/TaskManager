<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Hello extends Controller
{
    public function Hello(Request $request)
    {
        return 'hello';
    }
}
