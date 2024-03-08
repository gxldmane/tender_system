<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\api\Category\CategoryCollection;
use App\Http\Resources\api\Category\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return new CategoryCollection($categories);
    }

    public function show(Category $category)
    {
        return new CategoryResource($category);
    }
}
