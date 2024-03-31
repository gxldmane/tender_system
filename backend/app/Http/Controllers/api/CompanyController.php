<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Http\Resources\api\Company\CompanyCollection;
use App\Http\Resources\api\Company\CompanyResource;
use App\Models\Company;

class CompanyController extends Controller
{

    public function index()
    {
        return new CompanyCollection(Company::all());
    }

    public function show(Company $company)
    {
        return new CompanyResource($company->load('users'));
    }

}
