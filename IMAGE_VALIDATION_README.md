# ImageValidationService

A reusable service for validating uploaded images with configurable rules for different image types.

## Features

- ✅ File size validation
- ✅ MIME type validation
- ✅ Image dimension validation
- ✅ Aspect ratio validation with tolerance
- ✅ Configurable rules for different image types
- ✅ Laravel integration (Form Requests, Validation Rules)

## Available Image Types

| Type | Description | Max Size | Aspect Ratios | Min Dimensions |
|------|-------------|----------|---------------|----------------|
| `TYPE_BANNER` | Banner images (landscape) | 2MB | 16:9, 4:1, 3:1 | 800x200 |
| `TYPE_PRODUCT` | Product images | 1MB | 1:1, 4:3, 3:4 | 300x300 |
| `TYPE_CATEGORY` | Category images | 1MB | 1:1, 4:3 | 200x200 |
| `TYPE_AVATAR` | Avatar images | 512KB | 1:1 (strict) | 100x100 |
| `TYPE_LOGO` | Logo images | 1MB | Flexible ratios | 100x50 |

## Usage Examples

### 1. Basic Controller Usage

```php
<?php

namespace App\Http\Controllers;

use App\Services\ImageValidationService;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected ImageValidationService $imageValidator;

    public function __construct(ImageValidationService $imageValidator)
    {
        $this->imageValidator = $imageValidator;
    }

    public function store(Request $request)
    {
        // Validate the uploaded image
        if ($request->hasFile('image')) {
            $this->imageValidator->validateImage(
                $request->file('image'),
                ImageValidationService::TYPE_PRODUCT
            );
        }

        // Process upload...
    }
}
```

### 2. Form Request Integration

```php
<?php

namespace App\Http\Requests;

use App\Services\ImageValidationService;
use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    protected ImageValidationService $imageValidator;

    public function __construct(ImageValidationService $imageValidator)
    {
        $this->imageValidator = $imageValidator;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'image' => $this->imageValidator->generateValidationRules(
                ImageValidationService::TYPE_PRODUCT,
                true // required
            ),
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->hasFile('image')) {
                try {
                    app(ImageValidationService::class)->validateImage(
                        $this->file('image'),
                        ImageValidationService::TYPE_PRODUCT
                    );
                } catch (\Illuminate\Validation\ValidationException $e) {
                    $validator->errors()->merge($e->errors());
                }
            }
        });
    }
}
```

### 3. Custom Image Type

```php
// Add custom type to your service
private const VALIDATION_RULES = [
    // ... existing types
    'custom_type' => [
        'max_size' => 512, // KB
        'mime_types' => ['image/jpeg', 'image/png'],
        'aspect_ratios' => [
            ['ratio' => 2.5/1, 'tolerance' => 0.1], // Custom ratio
        ],
        'min_width' => 500,
        'min_height' => 200,
        'description' => 'Custom image type',
    ],
];

// Usage
$this->imageValidator->validateImage($file, 'custom_type');
```

## Error Messages

The service throws `ValidationException` with detailed error messages:

```
"Image size must not exceed 1024KB for Product images (square or standard photo ratios)."
"Image must be one of: jpeg, png, webp for Product images (square or standard photo ratios)."
"Image width must be at least 300px for Product images (square or standard photo ratios)."
"Image aspect ratio should be 1:1 (square) or 1.3:1 (landscape) or 1:1.3 (portrait) for Product images (square or standard photo ratios). Current: 1.5:1"
```

## API Methods

### `validateImage(UploadedFile $file, string $imageType): void`
Validates an uploaded file against rules for the specified image type.

### `getValidationRules(string $imageType): ?array`
Returns the validation rules array for an image type.

### `getAvailableTypes(): array`
Returns array of all available image type constants.

### `getTypeDescription(string $imageType): ?string`
Returns human-readable description for an image type.

### `generateValidationRules(string $imageType, bool $required = true): array`
Generates Laravel validation rules array for Form Requests.

## Aspect Ratio Tolerance

- **Banner**: ±10% tolerance for landscape ratios
- **Product**: ±10% tolerance for various ratios
- **Category**: ±10% tolerance for square/standard ratios
- **Avatar**: ±5% tolerance (strict square)
- **Logo**: ±20% tolerance (flexible)

## Best Practices

1. **Always validate before storing**: Use the service before moving files to storage
2. **Handle exceptions**: Wrap validation in try-catch blocks
3. **Use appropriate types**: Choose the right image type for your use case
4. **Combine with Laravel validation**: Use both Laravel rules and service validation
5. **Check file existence**: Always verify files exist before validation

## Extending the Service

To add new image types, simply add them to the `VALIDATION_RULES` constant:

```php
'new_type' => [
    'max_size' => 1024, // KB
    'mime_types' => ['image/jpeg', 'image/png'],
    'aspect_ratios' => [
        ['ratio' => 16/9, 'tolerance' => 0.1],
    ],
    'min_width' => 400,
    'min_height' => 225,
    'description' => 'New image type description',
],
```