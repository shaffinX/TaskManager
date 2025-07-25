<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Hello;
use App\Http\Controllers\Tasks;
Route::get('/hello',[Hello::class, 'Hello']);
Route::post('/create',[Tasks::class, 'create']);
Route::get('/getTask',[Tasks::class, 'getAll']);
Route::put('/editTask',[Tasks::class, 'editTask']);
Route::delete('/deleteTask/{id}',[Tasks::class, 'deleteTask']);