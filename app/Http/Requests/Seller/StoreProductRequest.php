<?php

namespace App\Http\Requests\Seller;

use App\Enums\ProductStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    /**
     * Request start time for performance monitoring
     */
    protected float $requestStartTime;

    /**
     * Initial memory usage for performance monitoring
     */
    protected int $initialMemoryUsage;

    /**
     * Create a new request instance.
     */
    public function __construct()
    {
        parent::__construct();

        // Initialize performance monitoring
        $this->requestStartTime = microtime(true);
        $this->initialMemoryUsage = memory_get_usage(true);
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $authStartTime = microtime(true);

        // Check rate limiting first to prevent spam
        if (!$this->checkRateLimit()) {
            // Log rate limit violation (already logged in checkRateLimit method)
            $this->logPerformanceMetrics('authorization', $authStartTime, 'rate_limited');
            return false;
        }

        // Basic authorization - user must be authenticated
        if (!Auth::check()) {
            Log::warning('Product creation authorization failed: User not authenticated', [
                'ip' => $this->ip(),
                'user_agent' => $this->userAgent(),
                'request_data' => $this->all(),
            ]);
            $this->logPerformanceMetrics('authorization', $authStartTime, 'unauthenticated');
            return false;
        }

        // Additional authorization checks should be handled by middleware or policies
        $this->logPerformanceMetrics('authorization', $authStartTime, 'success');
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
            'name' => ['required', 'string', 'max:255'], // Removed unique rule as name is JSON multilingual
            'name_en' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:1000'],
            'description_en' => ['nullable', 'string', 'max:1000'],
            'price' => ['nullable', 'numeric', 'min:0'],
            'stock' => ['nullable', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,category_id'],
            'brand_id' => ['required', 'exists:brands,brand_id'],
            'status' => ['required', Rule::in(ProductStatus::values())],
            'sku' => ['nullable', 'string', 'max:100', Rule::unique('product_variants', 'sku')],
            'variants' => ['required', 'array', 'min:1'],
            'variants.*.variant_name' => ['nullable', 'string', 'max:255'],
            'variants.*.sku' => ['nullable', 'string', 'max:100', Rule::unique('product_variants', 'sku')],
            'variants.*.price' => ['required', 'numeric', 'min:0'],
            'variants.*.stock_quantity' => ['required', 'integer', 'min:0'],
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
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $prepareStartTime = microtime(true);
        $user = Auth::user();
        $originalData = $this->all();

        // Sanitize and trim text fields for security
        $this->merge([
            'name' => $this->name ? $this->sanitizeText($this->name) : null,
            'name_en' => $this->name_en ? $this->sanitizeText($this->name_en) : null,
            'description' => $this->description ? $this->sanitizeText($this->description) : null,
            'description_en' => $this->description_en ? $this->sanitizeText($this->description_en) : null,
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

        // Log data preparation for security auditing
        $modifiedData = $this->all();
        if ($originalData != $modifiedData) {
            Log::info('Product creation data prepared: sanitized and trimmed', [
                'user_id' => $user?->id,
                'ip' => $this->ip(),
                'original_name' => $originalData['name'] ?? null,
                'modified_name' => $modifiedData['name'] ?? null,
                'original_description' => $originalData['description'] ?? null,
                'modified_description' => $modifiedData['description'] ?? null,
            ]);
        }

        $this->logPerformanceMetrics('data_preparation', $prepareStartTime, 'completed');
    }

    /**
     * Normalize variant payloads for the upcoming multi-variant workflow.
     *
     * @return array<int, array<string, mixed>>
     */
    protected function normalizeVariants(): array
    {
        $variants = $this->input('variants');

        if (!is_array($variants) || empty($variants)) {
            $variants = [[
                'variant_name' => null,
                'sku' => $this->input('sku'),
                'price' => $this->input('price'),
                'stock_quantity' => $this->input('stock'),
                'option_values' => [],
                'is_primary' => true,
            ]];
        }

        $normalized = [];
        $primaryPresent = false;

        foreach ($variants as $index => $variant) {
            if (!is_array($variant)) {
                continue;
            }

            $variantName = Arr::get($variant, 'variant_name');
            if (is_string($variantName) && $variantName !== '') {
                $variantName = $this->sanitizeText($variantName);
            } else {
                $variantName = null;
            }

            $sku = Arr::get($variant, 'sku');
            $sku = is_string($sku) && trim($sku) !== '' ? strtoupper(trim($sku)) : null;

            $price = Arr::get($variant, 'price');
            if (is_string($price)) {
                $normalizedPrice = preg_replace('/[^0-9.]/', '', $price);
                $price = is_numeric($normalizedPrice) ? (float) $normalizedPrice : $price;
            } elseif (is_numeric($price)) {
                $price = (float) $price;
            }

            $stock = Arr::get($variant, 'stock_quantity');
            if (is_string($stock) && is_numeric($stock)) {
                $stock = (int) $stock;
            } elseif (is_numeric($stock)) {
                $stock = (int) $stock;
            }

            $optionValues = $this->normalizeOptionValues(Arr::get($variant, 'option_values', []));
            $signature = $this->buildOptionSignature($optionValues);

            $isPrimary = $this->normalizeBoolean(Arr::get($variant, 'is_primary'), !$primaryPresent && $index === 0);
            if ($isPrimary) {
                $primaryPresent = true;
            }

            $normalized[] = [
                'variant_name' => $variantName,
                'sku' => $sku,
                'price' => $price,
                'stock_quantity' => $stock,
                'option_values' => !empty($optionValues) ? $optionValues : null,
                'option_signature' => $signature,
                'is_primary' => $isPrimary,
            ];
        }

        if (!$primaryPresent && isset($normalized[0])) {
            $normalized[0]['is_primary'] = true;
        }

        return array_values($normalized);
    }

    /**
     * Normalize option values into a consistent array structure.
     *
     * @param mixed $optionValues
     * @return array<int, array{name: string, value: string}>
     */
    protected function normalizeOptionValues(mixed $optionValues): array
    {
        if (!is_array($optionValues) || empty($optionValues)) {
            return [];
        }

        $normalized = [];

        foreach ($optionValues as $key => $option) {
            if (is_array($option)) {
                $name = Arr::get($option, 'name', is_string($key) ? $key : null);
                $value = Arr::get($option, 'value', Arr::get($option, 'label'));
            } else {
                $name = is_string($key) ? $key : null;
                $value = $option;
            }

            if (!is_string($name) || $name === '') {
                continue;
            }

            if (!is_string($value) && !is_numeric($value)) {
                continue;
            }

            $sanitizedName = $this->sanitizeOptionSegment((string) $name);
            $sanitizedValue = $this->sanitizeOptionSegment((string) $value);

            if ($sanitizedName === '' || $sanitizedValue === '') {
                continue;
            }

            $normalized[] = [
                'name' => $sanitizedName,
                'value' => $sanitizedValue,
            ];
        }

        return $normalized;
    }

    /**
     * Sanitize option name/value segments.
     */
    protected function sanitizeOptionSegment(string $value): string
    {
        $value = trim(strip_tags($value));
        $value = $this->removeMaliciousPatterns($value);

        return $value;
    }

    /**
     * Build a unique signature string for a variant's option combination.
     */
    protected function buildOptionSignature(array $optionValues): ?string
    {
        if (empty($optionValues)) {
            return null;
        }

        $segments = [];

        foreach ($optionValues as $option) {
            $name = Arr::get($option, 'name');
            $value = Arr::get($option, 'value');

            if (!is_string($name) || !is_string($value)) {
                continue;
            }

            $nameSegment = Str::slug(Str::lower($name));
            $valueSegment = Str::slug(Str::lower($value));

            if ($nameSegment === '' || $valueSegment === '') {
                continue;
            }

            $segments[] = $nameSegment . ':' . $valueSegment;
        }

        if (empty($segments)) {
            return null;
        }

        sort($segments);

        return Str::limit(implode('|', $segments), 255, '');
    }

    /**
     * Normalize various truthy/falsy values into a boolean.
     */
    protected function normalizeBoolean(mixed $value, bool $default = false): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        if (is_numeric($value)) {
            return (int) $value === 1;
        }

        if (is_string($value)) {
            $normalized = Str::lower(trim($value));

            if (in_array($normalized, ['1', 'true', 'yes', 'on'], true)) {
                return true;
            }

            if (in_array($normalized, ['0', 'false', 'no', 'off'], true)) {
                return false;
            }
        }

        return $default;
    }

    /**
     * Ensure submitted variants satisfy business invariants.
     */
    protected function validateVariantStructure($validator): void
    {
        $variants = $this->input('variants');

        if (!is_array($variants) || empty($variants)) {
            $validator->errors()->add('variants', 'At least one variant is required.');
            return;
        }

        $primaryIndexes = [];
        $signatures = [];
        $skus = [];

        foreach ($variants as $index => $variant) {
            if (!is_array($variant)) {
                continue;
            }

            if (Arr::get($variant, 'is_primary')) {
                $primaryIndexes[] = $index;
            }

            $signature = Arr::get($variant, 'option_signature');
            if ($signature) {
                if (isset($signatures[$signature])) {
                    $validator->errors()->add("variants.$index.option_values", 'Duplicate variant options detected. Each variant must use a unique option combination.');
                } else {
                    $signatures[$signature] = true;
                }
            }

            $sku = Arr::get($variant, 'sku');
            if ($sku) {
                if (isset($skus[$sku])) {
                    $validator->errors()->add("variants.$index.sku", 'Duplicate SKU detected in the submitted variants.');
                } else {
                    $skus[$sku] = true;
                }
            }
        }

        if (empty($primaryIndexes)) {
            $validator->errors()->add('variants.0.is_primary', 'At least one variant must be marked as primary.');
        } elseif (count($primaryIndexes) > 1) {
            $validator->errors()->add('variants', 'Only one variant can be marked as primary.');
        }
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     */
    public function withValidator($validator): void
    {
        $validationStartTime = microtime(true);
        $user = Auth::user();

        $validator->after(function ($validator) use ($user, $validationStartTime) {
            $this->validateVariantStructure($validator);
            $this->validateSecurityConstraints($validator, $user);

            if ($this->hasFile('images')) {
                $this->validateFileSecurity($validator);
            }

            $errors = $validator->errors();

            // Log validation failures for security monitoring
            if ($errors->isNotEmpty()) {
                Log::warning('Product creation validation failed', [
                    'user_id' => $user?->id,
                    'ip' => $this->ip(),
                    'user_agent' => $this->userAgent(),
                    'request_data' => $this->all(),
                    'validation_errors' => $errors->toArray(),
                    'error_count' => $errors->count(),
                ]);
                $this->logPerformanceMetrics('validation', $validationStartTime, 'failed', [
                    'error_count' => $errors->count(),
                    'has_security_errors' => $this->hasSecurityErrors($errors),
                ]);
            } else {
                $this->logPerformanceMetrics('validation', $validationStartTime, 'success');
            }
        });
    }

    /**
     * Check rate limiting for product creation to prevent spam.
     *
     * @return bool
     */
    protected function checkRateLimit(): bool
    {
        $user = Auth::user();

        // If user is not authenticated, allow rate limiting by IP
        $key = $user ? 'product_creation_user_' . $user->id : 'product_creation_ip_' . $this->ip();

        // Allow maximum 20 product creations per hour
        $maxAttempts = 20;
        $decayMinutes = 60; // 1 hour

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            // Log rate limit violation
            Log::warning('Product creation rate limit exceeded', [
                'user_id' => $user?->id,
                'ip' => $this->ip(),
                'attempts' => RateLimiter::attempts($key),
                'max_attempts' => $maxAttempts,
            ]);

            return false;
        }

        // Increment the counter
        RateLimiter::hit($key, $decayMinutes * 60); // Convert to seconds

        return true;
    }

    /**
     * Sanitize text input to prevent XSS attacks.
     *
     * @param string $text
     * @return string
     */
    protected function sanitizeText(string $text): string
    {
        // Trim whitespace first
        $text = trim($text);

        // Strip HTML tags to prevent XSS (keep basic formatting if needed)
        $text = strip_tags($text, '<br><p><strong><em>'); // Allow basic formatting tags

        // Additional security: remove potential script injection patterns
        $text = $this->removeMaliciousPatterns($text);

        return $text;
    }

    /**
     * Normalize incoming status value to enum-backed string for persistence.
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
     * Remove potentially malicious patterns from text.
     *
     * @param string $text
     * @return string
     */
    protected function removeMaliciousPatterns(string $text): string
    {
        // Remove potential script tags (double protection)
        $text = preg_replace('/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i', '', $text);

        // Remove javascript: protocols
        $text = preg_replace('/javascript:/i', '', $text);

        // Remove vbscript: protocols
        $text = preg_replace('/vbscript:/i', '', $text);

        // Remove data: URLs that might contain scripts
        $text = preg_replace('/data:\s*text\/html/i', '', $text);

        // Remove potential SQL injection patterns (basic protection)
        $text = preg_replace('/(\b(union|select|insert|update|delete|drop|create|alter)\b)/i', '', $text);

        return $text;
    }

    /**
     * Validate additional security constraints.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @param mixed $user
     * @return void
     */
    protected function validateSecurityConstraints($validator, $user): void
    {
        // Check for suspicious content patterns
        $this->validateContentSecurity($validator);

        // Check request frequency patterns (additional to rate limiting)
        $this->validateRequestPatterns($validator, $user);
    }

    /**
     * Validate content for security threats.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    protected function validateContentSecurity($validator): void
    {
        $suspiciousPatterns = [
            '/<script/i',
            '/javascript:/i',
            '/vbscript:/i',
            '/on\w+\s*=/i', // Event handlers
            '/<iframe/i',
            '/<object/i',
            '/<embed/i',
            '/data:\s*text/i',
        ];

    $fieldsToCheck = ['name', 'name_en', 'description', 'description_en'];

        foreach ($fieldsToCheck as $field) {
            $value = $this->input($field);
            if ($value && is_string($value)) {
                foreach ($suspiciousPatterns as $pattern) {
                    if (preg_match($pattern, $value)) {
                        $validator->errors()->add($field, 'Input contains potentially malicious content.');
                        Log::warning('Suspicious content detected in product creation', [
                            'field' => $field,
                            'pattern' => $pattern,
                            'value' => $value,
                            'ip' => $this->ip(),
                            'user_agent' => $this->userAgent(),
                        ]);
                        break;
                    }
                }
            }
        }
    }

    /**
     * Validate file upload security for images.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    protected function validateFileSecurity($validator): void
    {
        $files = $this->file('images');

        if ($files) {
            foreach ($files as $file) {
                if ($file) {
                    // Check file extension matches MIME type
                    $extension = strtolower($file->getClientOriginalExtension());
                    $mimeType = $file->getMimeType();

                    $allowedMimeTypes = [
                        'jpg' => 'image/jpeg',
                        'jpeg' => 'image/jpeg',
                        'png' => 'image/png',
                        'gif' => 'image/gif',
                    ];

                    if (isset($allowedMimeTypes[$extension]) && $mimeType !== $allowedMimeTypes[$extension]) {
                        $validator->errors()->add('images', 'File extension does not match file type.');
                        Log::warning('File type mismatch detected in product images', [
                            'extension' => $extension,
                            'mime_type' => $mimeType,
                            'expected_mime' => $allowedMimeTypes[$extension] ?? 'unknown',
                            'ip' => $this->ip(),
                        ]);
                    }

                    // Check for malicious file content (basic check)
                    $fileContent = file_get_contents($file->getPathname());
                    if (strpos($fileContent, '<?php') !== false || strpos($fileContent, '<script') !== false) {
                        $validator->errors()->add('images', 'File contains potentially malicious content.');
                        Log::warning('Malicious file content detected in product images', [
                            'filename' => $file->getClientOriginalName(),
                            'ip' => $this->ip(),
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Validate request patterns for additional security.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @param mixed $user
     * @return void
     */
    protected function validateRequestPatterns($validator, $user): void
    {
        // Check if user agent is suspicious
        $userAgent = $this->userAgent();
        if (empty($userAgent) || strlen($userAgent) < 10) {
            Log::warning('Suspicious user agent detected in product creation', [
                'user_agent' => $userAgent,
                'ip' => $this->ip(),
                'user_id' => $user?->id,
            ]);
        }

        // Check for rapid successive requests (additional to rate limiting)
        $cacheKey = 'product_request_pattern_' . ($user?->id ?: $this->ip());
        $recentRequests = Cache::get($cacheKey, []);

        // Keep only requests from last 10 seconds
        $recentRequests = array_filter($recentRequests, function ($timestamp) {
            return $timestamp > (time() - 10);
        });

        if (count($recentRequests) >= 5) {
            $validator->errors()->add('general', 'Too many rapid requests detected. Please slow down.');
            Log::warning('Rapid request pattern detected in product creation', [
                'request_count' => count($recentRequests),
                'time_window' => '10 seconds',
                'ip' => $this->ip(),
                'user_id' => $user?->id,
            ]);
        }

        // Add current request timestamp
        $recentRequests[] = time();
        Cache::put($cacheKey, $recentRequests, 10); // Cache for 10 seconds
    }

    /**
     * Log performance metrics for monitoring and optimization.
     *
     * @param string $operation
     * @param float $startTime
     * @param string $status
     * @param array $additionalData
     * @return void
     */
    protected function logPerformanceMetrics(string $operation, float $startTime, string $status, array $additionalData = []): void
    {
        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2); // Convert to milliseconds
        $currentMemory = memory_get_usage(true);
        $memoryUsed = $currentMemory - $this->initialMemoryUsage;
        $totalDuration = round(($endTime - $this->requestStartTime) * 1000, 2);

        $user = Auth::user();

        // Log performance metrics
        Log::info('Product creation performance metrics', [
            'operation' => $operation,
            'status' => $status,
            'duration_ms' => $duration,
            'total_duration_ms' => $totalDuration,
            'memory_used_bytes' => $memoryUsed,
            'memory_peak_bytes' => memory_get_peak_usage(true),
            'user_id' => $user?->id,
            'ip' => $this->ip(),
            'cache_hits' => $this->getCacheHits(),
            'db_queries' => $this->getQueryCount(),
            ...$additionalData,
        ]);

        // Alert on slow operations
        if ($duration > 1000) { // More than 1 second
            Log::warning('Slow product creation operation detected', [
                'operation' => $operation,
                'duration_ms' => $duration,
                'user_id' => $user?->id,
                'ip' => $this->ip(),
                'request_data' => $this->all(),
            ]);
        }

        // Alert on high memory usage
        if ($memoryUsed > 50 * 1024 * 1024) { // More than 50MB
            Log::warning('High memory usage in product creation', [
                'operation' => $operation,
                'memory_used_mb' => round($memoryUsed / 1024 / 1024, 2),
                'user_id' => $user?->id,
                'ip' => $this->ip(),
            ]);
        }
    }

    /**
     * Get cache hits count (simplified implementation).
     *
     * @return int
     */
    protected function getCacheHits(): int
    {
        // This is a simplified implementation
        // In a real application, you might use a cache wrapper to track hits
        return 0; // Placeholder
    }

    /**
     * Get database query count for this request.
     *
     * @return int
     */
    protected function getQueryCount(): int
    {
        // Get query count from Laravel's database connection
        $connection = app('db')->connection();
        return $connection->getQueryLog() ? count($connection->getQueryLog()) : 0;
    }

    /**
     * Check if validation errors contain security-related errors.
     *
     * @param \Illuminate\Support\MessageBag $errors
     * @return bool
     */
    protected function hasSecurityErrors($errors): bool
    {
        $securityErrorKeys = ['images', 'name', 'description'];
        $errorKeys = array_keys($errors->toArray());

        foreach ($errorKeys as $key) {
            if (in_array($key, $securityErrorKeys)) {
                return true;
            }
        }

        return false;
    }
}

