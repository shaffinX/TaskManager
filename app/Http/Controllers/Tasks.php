<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class Tasks extends Controller
{
    public function create(Request $request)
    {
        try{
            $data = array("title"=>$request->title, "description"=>$request->description, "status"=>$request->status, "priority"=>$request->priority);
            Task::insert($data);
            return response()->json(['message' => 'Task created successfully'], 200);
        }catch(\Exception $e){
            return response()->json(['message' => 'Error creating task: ' . $e->getMessage()], 500);
        }
    }
    public function getAll()
    {
        try {
            $tasks = Task::all();
            return response()->json($tasks);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error fetching tasks: ' . $e->getMessage()], 500);
        }
    }
    public function editTask(Request $request)
    {
        try {
            $task = Task::find($request->id);
            if ($task) {
                $task->title = $request->title;
                $task->description = $request->description;
                $task->status = $request->status;
                $task->priority = $request->priority;
                $task->save();
                return response()->json(['message' => 'Task updated successfully'], 200);
            } else {
                return response()->json(['message' => 'Task not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error updating task: ' . $e->getMessage()], 500);
        }
    }
    public function deleteTask($id)
    {
        error_log($id);
        try {
            $task = Task::find($id);
            
            if ($task) {
                $task->delete();
                return response()->json(['message' => 'Task deleted successfully'], 200);
            } else {
                return response()->json(['message' => 'Task not found'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error deleting task: ' . $e->getMessage()], 500);
        }
    }
}
