<?php

namespace App\Http\Requests\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\Rule;

class StoreCategoryRequest extends FormRequest
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
            Log::warning('Category creation authorization failed: User not authenticated', [
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
            'name' => 'required|array',
            'name.en' => [
                'required',
                'string',
                'max:100',
                'min:2',
                Rule::unique('categories', 'name->en')
            ],
            'name.vi' => [
                'required',
                'string',
                'max:100',
                'min:2',
                Rule::unique('categories', 'name->vi')
            ],
            'description' => 'nullable|array',
            'description.en' => 'nullable|string|max:500|min:2',
            'description.vi' => 'nullable|string|max:500|min:2',
            'parent_category_id' => 'nullable|exists:categories,category_id',
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
            'is_active.required' => 'Active status is required.',
            'is_active.boolean' => 'Active status must be true or false.',
            'image.image' => 'File must be a valid image.',
            'image.mimes' => 'Image must be a file of type: jpg, png, jpeg, webp.',
            'image.max' => 'Image size must not exceed 2MB.',
            'image.dimensions' => 'Image must be at least 100x100 pixels.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'name.en' => 'English category name',
            'name.vi' => 'Vietnamese category name',
            'description.en' => 'English description',
            'description.vi' => 'Vietnamese description',
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
        $prepareStartTime = microtime(true);
        $user = Auth::user();
        $originalData = $this->all();

        // Sanitize and trim text fields for security
        $this->merge([
            'name' => $this->name ? $this->sanitizeTextArray($this->name) : null,
            'description' => $this->description ? $this->sanitizeTextArray($this->description) : null,
        ]);

        // Log data preparation for security auditing
        $modifiedData = $this->all();
        if ($originalData != $modifiedData) {
            Log::info('Category creation data prepared: sanitized and trimmed', [
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
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     */
    public function withValidator($validator): void
    {
        $validationStartTime = microtime(true);
        $user = Auth::user();

        $validator->after(function ($validator) use ($user, $validationStartTime) {
            $errors = $validator->errors();

            // Log validation failures for security monitoring
            if ($errors->isNotEmpty()) {
                Log::warning('Category creation validation failed', [
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

            // Additional security validation
            $this->validateSecurityConstraints($validator, $user);

            // Additional business logic validation for category creation
            if ($this->parent_category_id) {
                $this->validateParentHierarchy($validator, $this->parent_category_id);

                // Log business logic validation if errors were added
                if ($validator->errors()->has('parent_category_id') && !$errors->has('parent_category_id')) {
                    Log::warning('Category creation business logic validation failed: circular reference detected', [
                        'user_id' => $user?->id,
                        'ip' => $this->ip(),
                        'parent_category_id' => $this->parent_category_id,
                        'request_data' => $this->all(),
                    ]);
                }
            }
        });
    }

    /**
     * Validate parent category hierarchy to prevent circular references.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @param int $parentId
     */
    protected function validateParentHierarchy($validator, int $parentId): void
    {
        // Check for circular reference in hierarchy
        $currentParent = $parentId;
        $visited = [];

        while ($currentParent) {
            if (in_array($currentParent, $visited)) {
                $validator->errors()->add('parent_category_id', 'This parent selection would create a circular reference.');
                break;
            }

            $visited[] = $currentParent;

            // Cache parent category lookup for 5 minutes to improve performance
            $parentCategory = Cache::remember(
                "category_{$currentParent}",
                300, // 5 minutes
                fn() => Category::find($currentParent)
            );

            if (!$parentCategory || !$parentCategory->parent_category_id) {
                break;
            }

            $currentParent = $parentCategory->parent_category_id;
        }
    }

    /**
     * Check rate limiting for category creation to prevent spam.
     *
     * @return bool
     */
    protected function checkRateLimit(): bool
    {
        $user = Auth::user();

        // If user is not authenticated, allow rate limiting by IP
        $key = $user ? 'category_creation_user_' . $user->id : 'category_creation_ip_' . $this->ip();

        // Allow maximum 10 category creations per hour
        $maxAttempts = 10;
        $decayMinutes = 60; // 1 hour

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            // Log rate limit violation
            Log::warning('Category creation rate limit exceeded', [
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
     * Log successful category creation for security auditing.
     *
     * @param Category $category
     * @return void
     */
    public function logSuccessfulCreation(Category $category): void
    {
        $user = Auth::user();

        Log::info('Category created successfully', [
            'user_id' => $user?->id,
            'category_id' => $category->category_id,
            'category_name' => $category->name,
            'parent_category_id' => $category->parent_category_id,
            'is_active' => $category->is_active,
            'ip' => $this->ip(),
            'user_agent' => $this->userAgent(),
            'request_data' => $this->all(),
            'created_at' => $category->created_at,
        ]);
    }

    /**
     * Sanitize text array input to prevent XSS attacks.
     *
     * @param array $textArray
     * @return array
     */
    protected function sanitizeTextArray(array $textArray): array
    {
        return array_map(function ($text) {
            if (!is_string($text)) {
                return $text;
            }

            // Trim whitespace first
            $text = trim($text);

            // Strip HTML tags to prevent XSS (keep basic formatting if needed)
            $text = strip_tags($text, '<br><p><strong><em>'); // Allow basic formatting tags

            // Additional security: remove potential script injection patterns
            $text = $this->removeMaliciousPatterns($text);

            return $text;
        }, $textArray);
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

        // Validate file upload security if image is present
        if ($this->hasFile('image')) {
            $this->validateFileSecurity($validator);
        }

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

        $fieldsToCheck = ['name.en', 'name.vi', 'description.en', 'description.vi'];

        foreach ($fieldsToCheck as $field) {
            $value = $this->input($field);
            if ($value && is_string($value)) {
                foreach ($suspiciousPatterns as $pattern) {
                    if (preg_match($pattern, $value)) {
                        $validator->errors()->add($field, 'Input contains potentially malicious content.');
                        Log::warning('Suspicious content detected in category creation', [
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
     * Validate file upload security.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    protected function validateFileSecurity($validator): void
    {
        $file = $this->file('image');

        if ($file) {
            // Check file extension matches MIME type
            $extension = strtolower($file->getClientOriginalExtension());
            $mimeType = $file->getMimeType();

            $allowedMimeTypes = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
            ];

            if (isset($allowedMimeTypes[$extension]) && $mimeType !== $allowedMimeTypes[$extension]) {
                $validator->errors()->add('image', 'File extension does not match file type.');
                Log::warning('File type mismatch detected', [
                    'extension' => $extension,
                    'mime_type' => $mimeType,
                    'expected_mime' => $allowedMimeTypes[$extension] ?? 'unknown',
                    'ip' => $this->ip(),
                ]);
            }

            // Check for malicious file content (basic check)
            $fileContent = file_get_contents($file->getPathname());
            if (strpos($fileContent, '<?php') !== false || strpos($fileContent, '<script') !== false) {
                $validator->errors()->add('image', 'File contains potentially malicious content.');
                Log::warning('Malicious file content detected', [
                    'filename' => $file->getClientOriginalName(),
                    'ip' => $this->ip(),
                ]);
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
            Log::warning('Suspicious user agent detected', [
                'user_agent' => $userAgent,
                'ip' => $this->ip(),
                'user_id' => $user?->id,
            ]);
        }

        // Check for rapid successive requests (additional to rate limiting)
        $cacheKey = 'category_request_pattern_' . ($user?->id ?: $this->ip());
        $recentRequests = Cache::get($cacheKey, []);

        // Keep only requests from last 10 seconds
        $recentRequests = array_filter($recentRequests, function ($timestamp) {
            return $timestamp > (time() - 10);
        });

        if (count($recentRequests) >= 3) {
            $validator->errors()->add('general', 'Too many rapid requests detected. Please slow down.');
            Log::warning('Rapid request pattern detected', [
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
        Log::info('Category creation performance metrics', [
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
            Log::warning('Slow category creation operation detected', [
                'operation' => $operation,
                'duration_ms' => $duration,
                'user_id' => $user?->id,
                'ip' => $this->ip(),
                'request_data' => $this->all(),
            ]);
        }

        // Alert on high memory usage
        if ($memoryUsed > 50 * 1024 * 1024) { // More than 50MB
            Log::warning('High memory usage in category creation', [
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
        $securityErrorKeys = ['image', 'name.en', 'name.vi', 'description.en', 'description.vi'];
        $errorKeys = array_keys($errors->toArray());

        foreach ($errorKeys as $key) {
            if (in_array($key, $securityErrorKeys)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get final performance summary for the entire request.
     *
     * @return array
     */
    public function getPerformanceSummary(): array
    {
        $totalDuration = round((microtime(true) - $this->requestStartTime) * 1000, 2);
        $totalMemoryUsed = memory_get_usage(true) - $this->initialMemoryUsage;

        return [
            'total_duration_ms' => $totalDuration,
            'total_memory_used_mb' => round($totalMemoryUsed / 1024 / 1024, 2),
            'peak_memory_mb' => round(memory_get_peak_usage(true) / 1024 / 1024, 2),
            'db_queries' => $this->getQueryCount(),
            'cache_hits' => $this->getCacheHits(),
        ];
    }
}
