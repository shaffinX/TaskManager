<?php

use Illuminate\Support\Facades\Route;
Route::get('/wel', function () {
    return view('welcome');
});
Route::get('/', function () {
    return view('tasks');
})->name('tasks');