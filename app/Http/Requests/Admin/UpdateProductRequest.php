<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $productId = $this->route('product')->product_id;

        return [
            'name' => [
                'required',
                'string',
                'max:200',
                Rule::unique('products', 'name')->ignore($productId, 'product_id')
            ],
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,category_id',
            'brand_id' => 'required|exists:brands,brand_id',
            'status' => 'required|integer|in:1,2,3,4',
        ];
    }
}