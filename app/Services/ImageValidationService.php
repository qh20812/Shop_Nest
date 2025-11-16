<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ImageValidationService
{
    // Image type constants
    public const TYPE_BANNER = 'banner';
    public const TYPE_PRODUCT = 'product';
    public const TYPE_CATEGORY = 'category';
    public const TYPE_AVATAR = 'avatar';
    public const TYPE_LOGO = 'logo';

    // Validation rules for each image type
    private const VALIDATION_RULES = [
        self::TYPE_BANNER => [
            'max_size' => 2048, // KB (2MB)
            'mime_types' => ['image/jpeg', 'image/png', 'image/webp'],
            'aspect_ratios' => [
                ['ratio' => 16/9, 'tolerance' => 0.1], // Landscape banner
                ['ratio' => 4/1, 'tolerance' => 0.1],  // Wide banner
                ['ratio' => 3/1, 'tolerance' => 0.1],  // Ultra wide banner
            ],
            'min_width' => 800,
            'min_height' => 200,
            'description' => 'Banner images (landscape orientation)',
        ],
        self::TYPE_PRODUCT => [
            'max_size' => 1024, // KB (1MB)
            'mime_types' => ['image/jpeg', 'image/png', 'image/webp'],
            'aspect_ratios' => [
                ['ratio' => 1/1, 'tolerance' => 0.1], // Square
                ['ratio' => 4/3, 'tolerance' => 0.1], // Standard photo
                ['ratio' => 3/4, 'tolerance' => 0.1], // Portrait
            ],
            'min_width' => 300,
            'min_height' => 300,
            'description' => 'Product images (square or standard photo ratios)',
        ],
        self::TYPE_CATEGORY => [
            'max_size' => 1024, // KB (1MB)
            'mime_types' => ['image/jpeg', 'image/png', 'image/webp'],
            'aspect_ratios' => [
                ['ratio' => 1/1, 'tolerance' => 0.1], // Square
                ['ratio' => 4/3, 'tolerance' => 0.1], // Standard
            ],
            'min_width' => 200,
            'min_height' => 200,
            'description' => 'Category images (square preferred)',
        ],
        self::TYPE_AVATAR => [
            'max_size' => 512, // KB (512KB)
            'mime_types' => ['image/jpeg', 'image/png', 'image/webp'],
            'aspect_ratios' => [
                ['ratio' => 1/1, 'tolerance' => 0.05], // Square only
            ],
            'min_width' => 100,
            'min_height' => 100,
            'max_width' => 1000,
            'max_height' => 1000,
            'description' => 'Avatar images (square, small size)',
        ],
        self::TYPE_LOGO => [
            'max_size' => 1024, // KB (1MB)
            'mime_types' => ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'],
            'aspect_ratios' => [
                ['ratio' => 1/1, 'tolerance' => 0.2], // Square-ish
                ['ratio' => 4/3, 'tolerance' => 0.2], // Rectangle
                ['ratio' => 3/1, 'tolerance' => 0.2], // Wide
            ],
            'min_width' => 100,
            'min_height' => 50,
            'description' => 'Logo images (flexible ratios)',
        ],
    ];

    /**
     * Validate an uploaded image file for a specific type
     *
     * @param UploadedFile $file
     * @param string $imageType
     * @throws ValidationException
     */
    public function validateImage(UploadedFile $file, string $imageType): void
    {
        if (!isset(self::VALIDATION_RULES[$imageType])) {
            throw ValidationException::withMessages([
                'image' => "Invalid image type: {$imageType}",
            ]);
        }

        $rules = self::VALIDATION_RULES[$imageType];
        $errors = [];

        // Validate file size
        if ($file->getSize() / 1024 > $rules['max_size']) {
            $errors['image'][] = "Image size must not exceed {$rules['max_size']}KB for {$rules['description']}.";
        }

        // Validate MIME type
        if (!in_array($file->getMimeType(), $rules['mime_types'])) {
            $allowedTypes = implode(', ', array_map(function($type) {
                return str_replace('image/', '', $type);
            }, $rules['mime_types']));
            $errors['image'][] = "Image must be one of: {$allowedTypes} for {$rules['description']}.";
        }

        // Get image dimensions
        try {
            $imageInfo = getimagesize($file->getRealPath());
            if (!$imageInfo) {
                $errors['image'][] = 'Invalid image file.';
                throw ValidationException::withMessages($errors);
            }

            $width = $imageInfo[0];
            $height = $imageInfo[1];

            // Validate minimum dimensions
            if (isset($rules['min_width']) && $width < $rules['min_width']) {
                $errors['image'][] = "Image width must be at least {$rules['min_width']}px for {$rules['description']}.";
            }

            if (isset($rules['min_height']) && $height < $rules['min_height']) {
                $errors['image'][] = "Image height must be at least {$rules['min_height']}px for {$rules['description']}.";
            }

            // Validate maximum dimensions (optional)
            if (isset($rules['max_width']) && $width > $rules['max_width']) {
                $errors['image'][] = "Image width must not exceed {$rules['max_width']}px for {$rules['description']}.";
            }

            if (isset($rules['max_height']) && $height > $rules['max_height']) {
                $errors['image'][] = "Image height must not exceed {$rules['max_height']}px for {$rules['description']}.";
            }

            // Validate aspect ratio
            if (!empty($rules['aspect_ratios'])) {
                $actualRatio = $width / $height;
                $validRatio = false;

                foreach ($rules['aspect_ratios'] as $ratioConfig) {
                    $expectedRatio = $ratioConfig['ratio'];
                    $tolerance = $ratioConfig['tolerance'];

                    if (abs($actualRatio - $expectedRatio) <= $tolerance) {
                        $validRatio = true;
                        break;
                    }
                }

                if (!$validRatio) {
                    $ratioDescriptions = array_map(function($ratioConfig) {
                        $ratio = $ratioConfig['ratio'];
                        if ($ratio == 1) return '1:1 (square)';
                        if ($ratio > 1) return number_format($ratio, 1) . ':1 (landscape)';
                        return '1:' . number_format(1/$ratio, 1) . ' (portrait)';
                    }, $rules['aspect_ratios']);

                    $errors['image'][] = "Image aspect ratio should be " . implode(' or ', $ratioDescriptions) . " for {$rules['description']}. Current: " . number_format($actualRatio, 2) . ':1';
                }
            }

        } catch (\Exception $e) {
            $errors['image'][] = 'Unable to process image file.';
        }

        if (!empty($errors)) {
            throw ValidationException::withMessages($errors);
        }
    }

    /**
     * Get validation rules for a specific image type
     *
     * @param string $imageType
     * @return array|null
     */
    public function getValidationRules(string $imageType): ?array
    {
        return self::VALIDATION_RULES[$imageType] ?? null;
    }

    /**
     * Get all available image types
     *
     * @return array
     */
    public function getAvailableTypes(): array
    {
        return array_keys(self::VALIDATION_RULES);
    }

    /**
     * Get human-readable description for an image type
     *
     * @param string $imageType
     * @return string|null
     */
    public function getTypeDescription(string $imageType): ?string
    {
        $rules = self::getValidationRules($imageType);
        return $rules ? $rules['description'] : null;
    }

    /**
     * Generate Laravel validation rules array for form requests
     *
     * @param string $imageType
     * @param bool $required
     * @return array
     */
    public function generateValidationRules(string $imageType, bool $required = true): array
    {
        $rules = self::getValidationRules($imageType);
        if (!$rules) {
            return $required ? ['required'] : ['nullable'];
        }

        $laravelRules = [];

        if ($required) {
            $laravelRules[] = 'required';
        } else {
            $laravelRules[] = 'nullable';
        }

        $laravelRules[] = 'image';
        $laravelRules[] = 'max:' . $rules['max_size'];

        // Convert MIME types to Laravel format
        $mimeTypes = array_map(function($mime) {
            return str_replace('image/', '', $mime);
        }, $rules['mime_types']);

        $laravelRules[] = 'mimes:' . implode(',', $mimeTypes);

        // Add dimensions rule if we have specific requirements
        if (isset($rules['min_width']) || isset($rules['max_width']) ||
            isset($rules['min_height']) || isset($rules['max_height'])) {

            $dimensions = [];
            if (isset($rules['min_width'])) $dimensions[] = "min_width={$rules['min_width']}";
            if (isset($rules['max_width'])) $dimensions[] = "max_width={$rules['max_width']}";
            if (isset($rules['min_height'])) $dimensions[] = "min_height={$rules['min_height']}";
            if (isset($rules['max_height'])) $dimensions[] = "max_height={$rules['max_height']}";

            if (!empty($dimensions)) {
                $laravelRules[] = 'dimensions:' . implode(',', $dimensions);
            }
        }

        return $laravelRules;
    }
}