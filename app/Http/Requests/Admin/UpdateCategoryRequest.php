<?php

namespace App\Http\Requests\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Basic authorization - user must be authenticated and category must exist
        // Additional authorization checks should be handled by middleware or policies
        return Auth::check() && $this->route('category') !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $categoryId = $this->route('category')?->category_id;

        return [
            'name' => 'required|array',
            'name.en' => [
                'required',
                'string',
                'max:100',
                'min:2',
                Rule::unique('categories', 'name->en')->ignore($categoryId, 'category_id')
            ],
            'name.vi' => [
                'required',
                'string',
                'max:100',
                'min:2',
                Rule::unique('categories', 'name->vi')->ignore($categoryId, 'category_id')
            ],
            'description' => 'nullable|array',
            'description.en' => 'nullable|string|max:500|min:2',
            'description.vi' => 'nullable|string|max:500|min:2',
            'parent_category_id' => [
                'nullable',
                'exists:categories,category_id',
                Rule::notIn([$categoryId]), // Prevent self-reference
            ],
            'is_active' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpg,png,jpeg,webp|max:2048|dimensions:min_width=100,min_height=100',
        ];
    }

    /**
     * Get custom validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.en.required' => 'English category name is required.',
            'name.vi.required' => 'Vietnamese category name is required.',
            'name.en.unique' => 'An English category with this name already exists.',
            'name.vi.unique' => 'A Vietnamese category with this name already exists.',
            'name.en.max' => 'English category name must not exceed 100 characters.',
            'name.vi.max' => 'Vietnamese category name must not exceed 100 characters.',
            'name.en.min' => 'English category name must be at least 2 characters.',
            'name.vi.min' => 'Vietnamese category name must be at least 2 characters.',
            'description.en.max' => 'English description must not exceed 500 characters.',
            'description.vi.max' => 'Vietnamese description must not exceed 500 characters.',
            'description.en.min' => 'English description must be at least 2 characters.',
            'description.vi.min' => 'Vietnamese description must be at least 2 characters.',
            'parent_category_id.not_in' => 'Category cannot be its own parent.',
            'is_active.required' => 'Active status is required.',
            'is_active.boolean' => 'Active status must be true or false.',
            'image.image' => 'File must be a valid image.',
            'image.mimes' => 'Image must be a file of type: jpg, png, jpeg, webp.',
            'image.max' => 'Image size must not exceed 2MB.',
            'image.dimensions' => 'Image must be at least 100x100 pixels.',
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
            'name.en' => 'english category name',
            'name.vi' => 'vietnamese category name',
            'description.en' => 'english description',
            'description.vi' => 'vietnamese description',
            'parent_category_id' => 'parent category',
            'is_active' => 'active status',
            'image' => 'category image',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Trim whitespace from text fields
        $this->merge([
            'name' => $this->name ? array_map('trim', $this->name) : null,
            'description' => $this->description ? array_map('trim', $this->description) : null,
        ]);
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $category = $this->route('category');

            // Additional business logic validation
            if ($category) {
                // Check if trying to set parent to a child category (prevent circular hierarchy)
                if ($this->parent_category_id) {
                    $this->validateParentHierarchy($validator, $category, $this->parent_category_id);
                }

                // Check if category is being deactivated while having active children
                if (isset($this->is_active) && !$this->is_active) {
                    $this->validateActiveChildren($validator, $category);
                }
            }
        });
    }

    /**
     * Validate parent category hierarchy to prevent circular references.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @param mixed $category
     * @param int $parentId
     */
    protected function validateParentHierarchy($validator, $category, int $parentId): void
    {
        // Prevent setting self as parent
        if ($category->category_id == $parentId) {
            $validator->errors()->add('parent_category_id', 'Category cannot be its own parent.');
            return;
        }

        // Check for circular reference in hierarchy
        $currentParent = $parentId;
        $visited = [$category->category_id];

        while ($currentParent) {
            if (in_array($currentParent, $visited)) {
                $validator->errors()->add('parent_category_id', 'This parent selection would create a circular reference.');
                break;
            }

            $visited[] = $currentParent;
            $parentCategory = Category::find($currentParent);

            if (!$parentCategory || !$parentCategory->parent_category_id) {
                break;
            }

            $currentParent = $parentCategory->parent_category_id;
        }
    }

    /**
     * Validate that category can be deactivated if it has active children.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @param mixed $category
     */
    protected function validateActiveChildren($validator, $category): void
    {
        $activeChildrenCount = Category::where('parent_category_id', $category->category_id)
            ->where('is_active', true)
            ->count();

        if ($activeChildrenCount > 0) {
            $validator->errors()->add(
                'is_active',
                "Cannot deactivate category while it has {$activeChildrenCount} active subcategories. Please deactivate subcategories first."
            );
        }
    }
}
