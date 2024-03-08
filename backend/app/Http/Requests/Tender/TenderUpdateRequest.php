<?php

namespace App\Http\Requests\Tender;

use Illuminate\Foundation\Http\FormRequest;

class TenderUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string'],
            'startPrice' => ['sometimes', 'required', 'integer'],
            'categoryId' => ['sometimes', 'required', 'exists:categories,id'],
            'regionId' => ['sometimes', 'required', 'exists:regions,id'],
            'untilDate' => ['sometimes', 'required', 'date']
        ];
    }
}
