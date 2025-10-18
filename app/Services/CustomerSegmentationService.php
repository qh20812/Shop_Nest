<?php

namespace App\Services;

use App\Models\CustomerSegment;
use App\Models\CustomerSegmentMembership;
use App\Models\User;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CustomerSegmentationService
{
    /**
     * Create a new customer segment
     */
    public function createSegment(array $data): CustomerSegment
    {
        try {
            return DB::transaction(function () use ($data) {
                $segment = CustomerSegment::create([
                    'name' => $data['name'],
                    'description' => $data['description'] ?? null,
                    'rules' => $data['rules'] ?? [],
                    'is_active' => $data['is_active'] ?? true,
                ]);

                // If customers are provided, add them to the segment
                if (!empty($data['customer_ids'])) {
                    $this->addCustomersToSegment($segment, $data['customer_ids']);
                }

                return $segment;
            });
        } catch (Exception $exception) {
            Log::error('Failed to create customer segment', ['exception' => $exception]);
            throw $exception;
        }
    }

    /**
     * Update an existing customer segment
     */
    public function updateSegment(CustomerSegment $segment, array $data): CustomerSegment
    {
        try {
            return DB::transaction(function () use ($segment, $data) {
                $segment->update([
                    'name' => $data['name'],
                    'description' => $data['description'] ?? null,
                    'rules' => $data['rules'] ?? $segment->rules,
                    'is_active' => $data['is_active'] ?? $segment->is_active,
                ]);

                // Update customer list if provided
                if (isset($data['customer_ids'])) {
                    $this->syncCustomersToSegment($segment, $data['customer_ids']);
                }

                return $segment;
            });
        } catch (Exception $exception) {
            Log::error('Failed to update customer segment', ['exception' => $exception]);
            throw $exception;
        }
    }

    /**
     * Delete a customer segment
     */
    public function deleteSegment(CustomerSegment $segment): bool
    {
        try {
            $segment->delete();
            return true;
        } catch (Exception $exception) {
            Log::error('Failed to delete customer segment', ['exception' => $exception]);
            throw $exception;
        }
    }

    /**
     * Add customers to a segment
     */
    public function addCustomersToSegment(CustomerSegment $segment, array $customerIds): void
    {
        $existingMemberships = $segment->memberships()->pluck('customer_id')->toArray();
        $newCustomerIds = array_diff($customerIds, $existingMemberships);

        foreach ($newCustomerIds as $customerId) {
            CustomerSegmentMembership::create([
                'segment_id' => $segment->segment_id,
                'customer_id' => $customerId,
                'joined_at' => now(),
            ]);
        }

        // Update customer count
        $segment->updateCustomerCount();
    }

    /**
     * Remove customers from a segment
     */
    public function removeCustomersFromSegment(CustomerSegment $segment, array $customerIds): void
    {
        $segment->memberships()
            ->whereIn('customer_id', $customerIds)
            ->delete();

        // Update customer count
        $segment->updateCustomerCount();
    }

    /**
     * Sync customers to a segment (replace existing)
     */
    public function syncCustomersToSegment(CustomerSegment $segment, array $customerIds): void
    {
        // Remove existing memberships
        $segment->memberships()->delete();

        // Add new memberships
        foreach ($customerIds as $customerId) {
            CustomerSegmentMembership::create([
                'segment_id' => $segment->segment_id,
                'customer_id' => $customerId,
                'joined_at' => now(),
            ]);
        }

        // Update customer count
        $segment->updateCustomerCount();
    }

    /**
     * Evaluate customer against segment rules
     */
    public function evaluateCustomerForSegment(User $customer, CustomerSegment $segment): bool
    {
        // Cache evaluation results for performance
        $cacheKey = "segment:{$segment->segment_id}:customer:{$customer->id}:rules:" . md5(serialize($segment->rules));

        return Cache::remember($cacheKey, 3600, function () use ($customer, $segment) {
            return $this->evaluateRules($customer, $segment->rules);
        });
    }

    /**
     * Evaluate rules without caching (internal method)
     */
    private function evaluateRules(User $customer, array $rules): bool
    {
        if (empty($rules)) {
            return false;
        }

        // Evaluate each rule
        foreach ($rules as $rule) {
            if (!$this->evaluateRule($customer, $rule)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Evaluate a single rule against a customer
     */
    private function evaluateRule(User $customer, array $rule): bool
    {
        // Validate rule structure
        if (!isset($rule['field']) || !isset($rule['operator']) || !isset($rule['value'])) {
            Log::warning('Invalid rule structure', ['rule' => $rule]);
            return false;
        }

        $field = $rule['field'];
        $operator = $rule['operator'];
        $value = $rule['value'];

        // Validate operator
        $validOperators = [
            'equals', 'not_equals', 'greater_than', 'less_than',
            'greater_than_or_equal', 'less_than_or_equal',
            'contains', 'not_contains', 'starts_with', 'ends_with',
            'in', 'not_in'
        ];

        if (!in_array($operator, $validOperators)) {
            Log::warning('Invalid operator in rule', ['operator' => $operator]);
            return false;
        }

        // Get customer field value
        $customerValue = $this->getCustomerFieldValue($customer, $field);

        // Evaluate based on operator
        switch ($operator) {
            case 'equals':
                return $customerValue == $value;
            case 'not_equals':
                return $customerValue != $value;
            case 'greater_than':
                return $customerValue > $value;
            case 'less_than':
                return $customerValue < $value;
            case 'greater_than_or_equal':
                return $customerValue >= $value;
            case 'less_than_or_equal':
                return $customerValue <= $value;
            case 'contains':
                return is_string($customerValue) && is_string($value) &&
                       str_contains(strtolower($customerValue), strtolower($value));
            case 'not_contains':
                return is_string($customerValue) && is_string($value) &&
                       !str_contains(strtolower($customerValue), strtolower($value));
            case 'starts_with':
                return is_string($customerValue) && is_string($value) &&
                       str_starts_with(strtolower($customerValue), strtolower($value));
            case 'ends_with':
                return is_string($customerValue) && is_string($value) &&
                       str_ends_with(strtolower($customerValue), strtolower($value));
            case 'in':
                return in_array($customerValue, (array) $value);
            case 'not_in':
                return !in_array($customerValue, (array) $value);
            default:
                return false;
        }
    }

    /**
     * Get customer field value for rule evaluation
     */
    private function getCustomerFieldValue(User $customer, string $field)
    {
        switch ($field) {
            case 'total_orders':
                return $customer->orders()->count();
            case 'total_spent':
                return $customer->orders()->sum('total_amount');
            case 'average_order_value':
                $orderCount = $customer->orders()->count();
                return $orderCount > 0 ? $customer->orders()->sum('total_amount') / $orderCount : 0;
            case 'last_order_date':
                return $customer->orders()->latest('created_at')->first()?->created_at?->timestamp ?? 0;
            case 'registration_date':
                return $customer->created_at->timestamp;
            case 'days_since_registration':
                return now()->diffInDays($customer->created_at);
            case 'days_since_last_order':
                $lastOrder = $customer->orders()->latest('created_at')->first();
                return $lastOrder ? now()->diffInDays($lastOrder->created_at) : 999;
            default:
                return $customer->{$field} ?? null;
        }
    }

    /**
     * Refresh segment customer list based on rules
     */
    public function refreshSegmentCustomers(CustomerSegment $segment): void
    {
        if (empty($segment->rules)) {
            return;
        }

        try {
            // Build query based on rules instead of loading all customers
            $query = User::whereHas('roles', function ($query) {
                $query->where('name', 'customer');
            });

            foreach ($segment->rules as $rule) {
                $this->applyRuleToQuery($query, $rule);
            }

            $customerIds = $query->pluck('id')->toArray();
            $this->syncCustomersToSegment($segment, $customerIds);

        } catch (Exception $exception) {
            Log::error('Failed to refresh segment customers', [
                'segment_id' => $segment->segment_id,
                'exception' => $exception
            ]);
            throw $exception;
        }
    }

    /**
     * Apply a rule condition to the query builder
     */
    private function applyRuleToQuery($query, array $rule): void
    {
        $field = $rule['field'];
        $operator = $rule['operator'];
        $value = $rule['value'];

        switch ($field) {
            case 'total_orders':
                $this->applyOrderCountRule($query, $operator, $value);
                break;
            case 'total_spent':
                $this->applyTotalSpentRule($query, $operator, $value);
                break;
            case 'average_order_value':
                $this->applyAverageOrderValueRule($query, $operator, $value);
                break;
            case 'last_order_date':
                $this->applyLastOrderDateRule($query, $operator, $value);
                break;
            case 'registration_date':
                $this->applyRegistrationDateRule($query, $operator, $value);
                break;
            case 'days_since_registration':
                $this->applyDaysSinceRegistrationRule($query, $operator, $value);
                break;
            case 'days_since_last_order':
                $this->applyDaysSinceLastOrderRule($query, $operator, $value);
                break;
            default:
                // For simple user fields
                $this->applySimpleFieldRule($query, $field, $operator, $value);
                break;
        }
    }

    /**
     * Apply rule for order count
     */
    private function applyOrderCountRule($query, string $operator, $value): void
    {
        $query->whereHas('orders', function ($orderQuery) use ($operator, $value) {
            $orderQuery->selectRaw('COUNT(*) as order_count')
                      ->havingRaw("COUNT(*) {$this->mapOperatorToSql($operator)} ?", [$value])
                      ->groupBy('customer_id');
        });
    }

    /**
     * Apply rule for total spent
     */
    private function applyTotalSpentRule($query, string $operator, $value): void
    {
        $query->whereHas('orders', function ($orderQuery) use ($operator, $value) {
            $orderQuery->selectRaw('SUM(total_amount) as total_spent')
                      ->havingRaw("SUM(total_amount) {$this->mapOperatorToSql($operator)} ?", [$value])
                      ->groupBy('customer_id');
        });
    }

    /**
     * Apply rule for average order value
     */
    private function applyAverageOrderValueRule($query, string $operator, $value): void
    {
        $query->whereHas('orders', function ($orderQuery) use ($operator, $value) {
            $orderQuery->selectRaw('AVG(total_amount) as avg_order_value')
                      ->havingRaw("AVG(total_amount) {$this->mapOperatorToSql($operator)} ?", [$value])
                      ->groupBy('customer_id');
        });
    }

    /**
     * Apply rule for last order date
     */
    private function applyLastOrderDateRule($query, string $operator, $value): void
    {
        $query->whereHas('orders', function ($orderQuery) use ($operator, $value) {
            $orderQuery->selectRaw('MAX(created_at) as last_order_date')
                      ->havingRaw("MAX(created_at) {$this->mapOperatorToSql($operator)} ?", [$value])
                      ->groupBy('customer_id');
        });
    }

    /**
     * Apply rule for registration date
     */
    private function applyRegistrationDateRule($query, string $operator, $value): void
    {
        $query->where('created_at', $this->mapOperatorToSql($operator), $value);
    }

    /**
     * Apply rule for days since registration
     */
    private function applyDaysSinceRegistrationRule($query, string $operator, $value): void
    {
        $days = now()->subDays($value)->toDateString();
        $query->where('created_at', $this->mapOperatorToSql($operator), $days);
    }

    /**
     * Apply rule for days since last order
     */
    private function applyDaysSinceLastOrderRule($query, string $operator, $value): void
    {
        $cutoffDate = now()->subDays($value)->toDateString();

        $query->whereHas('orders', function ($orderQuery) use ($operator, $cutoffDate) {
            $orderQuery->selectRaw('MAX(created_at) as last_order_date')
                      ->havingRaw("MAX(created_at) {$this->mapOperatorToSql($operator)} ?", [$cutoffDate])
                      ->groupBy('customer_id');
        });
    }

    /**
     * Apply rule for simple user fields
     */
    private function applySimpleFieldRule($query, string $field, string $operator, $value): void
    {
        $query->where($field, $this->mapOperatorToSql($operator), $value);
    }

    /**
     * Map rule operator to SQL operator
     */
    private function mapOperatorToSql(string $operator): string
    {
        return match ($operator) {
            'equals' => '=',
            'not_equals' => '!=',
            'greater_than' => '>',
            'less_than' => '<',
            'greater_than_or_equal' => '>=',
            'less_than_or_equal' => '<=',
            default => '='
        };
    }

    /**
     * Get segment statistics
     */
    public function getSegmentStats(CustomerSegment $segment): array
    {
        $memberships = $segment->memberships()->with('customer')->get();

        $totalSpent = $memberships->sum(function ($membership) {
            return $membership->customer->orders()->sum('total_amount');
        });

        $averageSpent = $memberships->count() > 0 ? $totalSpent / $memberships->count() : 0;

        $recentMemberships = $memberships->where('joined_at', '>=', now()->subDays(30))->count();

        return [
            'total_customers' => $memberships->count(),
            'total_spent' => $totalSpent,
            'average_spent_per_customer' => round($averageSpent, 2),
            'new_customers_last_30_days' => $recentMemberships,
            'segment_size_category' => $segment->getSizeCategoryAttribute(),
        ];
    }

    /**
     * Get customers eligible for a segment based on rules
     */
    public function getEligibleCustomers(CustomerSegment $segment, int $limit = null): Collection
    {
        if (empty($segment->rules)) {
            return collect();
        }

        $customers = User::whereHas('roles', function ($query) {
            $query->where('name', 'customer');
        });

        if ($limit) {
            $customers = $customers->limit($limit);
        }

        return $customers->get()->filter(function ($customer) use ($segment) {
            return $this->evaluateCustomerForSegment($customer, $segment);
        });
    }
}