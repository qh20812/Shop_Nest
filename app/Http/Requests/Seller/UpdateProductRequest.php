<?php

namespace App\Http\Requests\Seller;

use App\Enums\ProductStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Basic authorization - user must be authenticated and product must exist
        // Additional authorization checks should be handled by middleware or policies
        return Auth::check() && $this->route('product') !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     * These rules ensure data integrity during product updates, including unique constraints
     * that ignore the current product ID to allow updates without false uniqueness violations.
     * This is crucial for update operations to prevent conflicts while maintaining data consistency.
     *
     * Lấy các quy tắc validation áp dụng cho request.
     * Những quy tắc này đảm bảo tính toàn vẹn dữ liệu khi cập nhật sản phẩm, bao gồm ràng buộc duy nhất
     * bỏ qua ID sản phẩm hiện tại để cho phép cập nhật mà không vi phạm tính duy nhất giả.
     * Điều này rất quan trọng cho các thao tác cập nhật để ngăn xung đột đồng thời duy trì tính nhất quán dữ liệu.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $product = $this->route('product');
        $productId = $product?->getKey();
        $primaryVariantId = $product?->variants()->orderBy('created_at')->value('variant_id');

        return [
            'name' => [
                'nullable',
                'string',
                'max:255'
            ], // Removed unique rule as name is JSON multilingual
            'name_en' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'description_en' => ['nullable', 'string', 'max:1000'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'category_id' => ['nullable', 'exists:categories,category_id'],
            'brand_id' => ['nullable', 'exists:brands,brand_id'],
            'status' => ['nullable', Rule::in(ProductStatus::values())],
            'sku' => [
                'nullable',
                'string',
                'max:100',
                Rule::unique('product_variants', 'sku')->ignore($primaryVariantId, 'variant_id')
            ],
            'variants' => ['nullable', 'array', 'min:1'],
            'variants.*.variant_name' => ['nullable', 'string', 'max:255'],
            'variants.*.sku' => ['nullable', 'string', 'max:100', Rule::unique('product_variants', 'sku')->ignore($primaryVariantId, 'variant_id')],
            'variants.*.price' => ['nullable', 'numeric', 'min:0'],
            'variants.*.stock_quantity' => ['nullable', 'integer', 'min:0'],
            'variants.*.option_values' => ['nullable', 'array'],
            'variants.*.option_values.*.name' => ['required_with:variants.*.option_values', 'string', 'max:100'],
            'variants.*.option_values.*.value' => ['required_with:variants.*.option_values', 'string', 'max:255'],
            'variants.*.is_primary' => ['sometimes', 'boolean'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,gif', 'max:2048', 'dimensions:min_width=100,min_height=100'],
            'meta_title' => ['nullable', 'string', 'max:200'],
            'meta_slug' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom validation messages.
     * Provides user-friendly error messages for validation failures during product updates,
     * improving user experience by clearly explaining what went wrong and how to fix it.
     * This is essential for update operations where users need precise feedback to correct data.
     *
     * Lấy các thông báo validation tùy chỉnh.
     * Cung cấp thông báo lỗi thân thiện với người dùng cho các thất bại validation trong quá trình cập nhật sản phẩm,
     * cải thiện trải nghiệm người dùng bằng cách giải thích rõ ràng điều gì đã sai và cách sửa chữa.
     * Điều này rất cần thiết cho các thao tác cập nhật nơi người dùng cần phản hồi chính xác để sửa dữ liệu.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'name.string' => 'Product name must be a string.',
            'name.max' => 'Product name must not exceed 255 characters.',
            'name_en.string' => 'English product name must be a string.',
            'name_en.max' => 'English product name must not exceed 255 characters.',
            'description.string' => 'Description must be a string.',
            'description.max' => 'Description must not exceed 1000 characters.',
            'description_en.string' => 'English description must be a string.',
            'description_en.max' => 'English description must not exceed 1000 characters.',
            'price.required' => 'Price is required.',
            'price.numeric' => 'Price must be a number.',
            'price.min' => 'Price must be at least 0.',
            'stock.required' => 'Stock is required.',
            'stock.integer' => 'Stock must be an integer.',
            'stock.min' => 'Stock must be at least 0.',
            'category_id.required' => 'Category is required.',
            'category_id.exists' => 'Selected category does not exist.',
            'brand_id.required' => 'Brand is required.',
            'brand_id.exists' => 'Selected brand does not exist.',
            'status.required' => 'Status is required.',
            'status.in' => 'Status must be one of: draft, pending approval, published, or hidden.',
            'sku.string' => 'SKU must be a string.',
            'sku.max' => 'SKU must not exceed 100 characters.',
            'sku.unique' => 'This SKU is already in use.',
            'variants.required' => 'At least one variant is required.',
            'variants.array' => 'Variants must be provided as an array.',
            'variants.min' => 'At least one variant is required.',
            'variants.*.variant_name.string' => 'Variant name must be a string.',
            'variants.*.variant_name.max' => 'Variant name must not exceed 255 characters.',
            'variants.*.sku.string' => 'Each variant SKU must be a string.',
            'variants.*.sku.max' => 'Each variant SKU must not exceed 100 characters.',
            'variants.*.sku.unique' => 'This SKU is already in use.',
            'variants.*.price.required' => 'Each variant must have a price.',
            'variants.*.price.numeric' => 'Variant price must be a number.',
            'variants.*.price.min' => 'Variant price must be at least 0.',
            'variants.*.stock_quantity.required' => 'Each variant must include a stock quantity.',
            'variants.*.stock_quantity.integer' => 'Variant stock must be an integer.',
            'variants.*.stock_quantity.min' => 'Variant stock must be at least 0.',
            'variants.*.option_values.array' => 'Variant options must be an array.',
            'variants.*.option_values.*.name.required_with' => 'Each option must include a name.',
            'variants.*.option_values.*.name.string' => 'Option name must be a string.',
            'variants.*.option_values.*.name.max' => 'Option name must not exceed 100 characters.',
            'variants.*.option_values.*.value.required_with' => 'Each option must include a value.',
            'variants.*.option_values.*.value.string' => 'Option value must be a string.',
            'variants.*.option_values.*.value.max' => 'Option value must not exceed 255 characters.',
            'variants.*.is_primary.boolean' => 'The primary flag must be true or false.',
            'images.array' => 'Images must be an array.',
            'images.*.image' => 'Each file must be a valid image.',
            'images.*.mimes' => 'Image must be a file of type: jpeg, png, jpg, gif.',
            'images.*.max' => 'Image size must not exceed 2MB.',
            'images.*.dimensions' => 'Image must be at least 100x100 pixels.',
            'meta_title.string' => 'Meta title must be a string.',
            'meta_title.max' => 'Meta title must not exceed 200 characters.',
            'meta_slug.string' => 'Meta slug must be a string.',
            'meta_slug.max' => 'Meta slug must not exceed 255 characters.',
            'meta_description.string' => 'Meta description must be a string.',
            'meta_description.max' => 'Meta description must not exceed 1000 characters.',
        ];
    }

    /**
     * Get custom attribute names.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name' => 'product name',
            'name_en' => 'english product name',
            'description' => 'description',
            'description_en' => 'english description',
            'price' => 'price',
            'stock' => 'stock',
            'category_id' => 'category',
            'brand_id' => 'brand',
            'status' => 'status',
            'sku' => 'SKU',
            'images' => 'product images',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Trim whitespace from text fields
        $this->merge([
            'name' => $this->name ? trim($this->name) : null,
            'name_en' => $this->name_en ? trim($this->name_en) : null,
            'description' => $this->description ? trim($this->description) : null,
            'description_en' => $this->description_en ? trim($this->description_en) : null,
            'status' => $this->normalizeStatus($this->status),
        ]);

        $normalizedVariants = $this->normalizeVariants();

        if (!empty($normalizedVariants)) {
            $primaryVariant = $normalizedVariants[0];

            $this->merge([
                'variants' => $normalizedVariants,
                'sku' => Arr::get($primaryVariant, 'sku'),
                'price' => Arr::get($primaryVariant, 'price'),
                'stock' => Arr::get($primaryVariant, 'stock_quantity'),
            ]);
        }
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $this->validateVariantStructure($validator);

            $product = $this->route('product');

            // Additional business logic validation to enforce domain rules beyond standard validation
            // Kiểm tra logic nghiệp vụ bổ sung để thực thi các quy tắc miền ngoài validation tiêu chuẩn
            if ($product) {
                // Check if stock is being set to negative (additional safety)
                // Kiểm tra xem stock có được đặt thành âm không (an toàn bổ sung)
                if (isset($this->stock) && $this->stock < 0) {
                    $validator->errors()->add('stock', 'Stock cannot be negative.');
                }

                // Additional validation can be added here as needed
                // Có thể thêm validation bổ sung ở đây nếu cần
            }
        });
    }

        /**
         * Normalize incoming status to enum-backed string before validation.
         */
        private function normalizeStatus(mixed $status): string
        {
            if ($status instanceof ProductStatus) {
                return $status->value;
            }

            if (is_numeric($status)) {
                return ProductStatus::fromLegacyInt((int) $status)->value;
            }

            if (is_string($status) && in_array($status, ProductStatus::values(), true)) {
                return $status;
            }

            return ProductStatus::DRAFT->value;
        }

        /**
         * Normalize variants data for validation.
         */
        private function normalizeVariants(): array
        {
            $variants = $this->input('variants', []);

            if (empty($variants)) {
                // Fallback to legacy single variant format
                $variants = [[
                    'sku' => $this->input('sku'),
                    'price' => $this->input('price'),
                    'stock_quantity' => $this->input('stock'),
                    'is_primary' => true,
                ]];
            }

            $normalized = [];
            $hasPrimary = false;

            foreach ($variants as $index => $variant) {
                $normalizedVariant = [
                    'variant_name' => Arr::get($variant, 'variant_name'),
                    'sku' => Arr::get($variant, 'sku') ? strtoupper(trim(Arr::get($variant, 'sku'))) : null,
                    'price' => (float) Arr::get($variant, 'price', 0),
                    'stock_quantity' => (int) Arr::get($variant, 'stock_quantity', 0),
                    'option_values' => Arr::get($variant, 'option_values', []),
                    'is_primary' => (bool) Arr::get($variant, 'is_primary', false),
                ];

                // Generate option_signature if option_values exist
                if (!empty($normalizedVariant['option_values'])) {
                    $signatureParts = [];
                    foreach ($normalizedVariant['option_values'] as $option) {
                        $name = Str::slug(Arr::get($option, 'name', ''), '_');
                        $value = Str::slug(Arr::get($option, 'value', ''), '_');
                        $signatureParts[] = "{$name}:{$value}";
                    }
                    sort($signatureParts);
                    $normalizedVariant['option_signature'] = implode('|', $signatureParts);
                } else {
                    $normalizedVariant['option_signature'] = null;
                }

                // Ensure only one primary variant
                if ($normalizedVariant['is_primary']) {
                    if ($hasPrimary) {
                        $normalizedVariant['is_primary'] = false;
                    } else {
                        $hasPrimary = true;
                    }
                }

                $normalized[] = $normalizedVariant;
            }

            // If no primary set, make first one primary
            if (!$hasPrimary && !empty($normalized)) {
                $normalized[0]['is_primary'] = true;
            }

            return $normalized;
        }

        /**
         * Validate variant structure and business rules.
         */
        private function validateVariantStructure($validator): void
        {
            $variants = $this->input('variants', []);

            if (empty($variants)) {
                return;
            }

            $product = $this->route('product');
            $existingSignatures = [];
            $existingSkus = [];
            $primaryCount = 0;

            foreach ($variants as $index => $variant) {
                $sku = Arr::get($variant, 'sku');
                $signature = Arr::get($variant, 'option_signature');
                $isPrimary = (bool) Arr::get($variant, 'is_primary', false);

                // Check for duplicate SKUs within the request
                if ($sku && in_array($sku, $existingSkus)) {
                    $validator->errors()->add("variants.{$index}.sku", 'Duplicate SKU within variants.');
                } elseif ($sku) {
                    $existingSkus[] = $sku;
                }

                // Check for duplicate option signatures within the request
                if ($signature && in_array($signature, $existingSignatures)) {
                    $validator->errors()->add("variants.{$index}.option_values", 'Duplicate option combination within variants.');
                } elseif ($signature) {
                    $existingSignatures[] = $signature;
                }

                // Count primary variants
                if ($isPrimary) {
                    $primaryCount++;
                }
            }

            // Ensure exactly one primary variant
            if ($primaryCount === 0) {
                $validator->errors()->add('variants', 'At least one variant must be marked as primary.');
            } elseif ($primaryCount > 1) {
                $validator->errors()->add('variants', 'Only one variant can be marked as primary.');
            }

            // Check against existing variants in database for updates
            if ($product) {
                foreach ($variants as $index => $variant) {
                    $sku = Arr::get($variant, 'sku');
                    $signature = Arr::get($variant, 'option_signature');

                    if ($sku) {
                        $existingVariant = $product->variants()->where('sku', $sku)->where('variant_id', '!=', Arr::get($variant, 'variant_id'))->exists();
                        if ($existingVariant) {
                            $validator->errors()->add("variants.{$index}.sku", 'This SKU is already in use by another variant.');
                        }
                    }

                    if ($signature) {
                        $existingVariant = $product->variants()->where('option_signature', $signature)->where('variant_id', '!=', Arr::get($variant, 'variant_id'))->exists();
                        if ($existingVariant) {
                            $validator->errors()->add("variants.{$index}.option_values", 'This option combination is already in use by another variant.');
                        }
                    }
                }
            }
        }
}
