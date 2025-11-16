<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ImageValidationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BannerController extends Controller
{
    protected ImageValidationService $imageValidator;

    public function __construct(ImageValidationService $imageValidator)
    {
        $this->imageValidator = $imageValidator;
    }

    /**
     * Example: Store a banner with proper image validation
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => $this->imageValidator->generateValidationRules(
                ImageValidationService::TYPE_BANNER,
                true // required
            ),
        ]);

        // Additional validation using the service
        if ($request->hasFile('image')) {
            $this->imageValidator->validateImage(
                $request->file('image'),
                ImageValidationService::TYPE_BANNER
            );
        }

        // Store banner logic here...
        $imagePath = $request->file('image')->store('banners', 'public');
        $bannerUrl = '/storage/' . $imagePath;

        // Create banner record...

        return redirect()->back()->with('success', 'Banner created successfully!');
    }

    /**
     * Example: Update banner with image validation
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'image' => $this->imageValidator->generateValidationRules(
                ImageValidationService::TYPE_BANNER,
                false // optional for updates
            ),
        ]);

        // Additional validation for uploaded image
        if ($request->hasFile('image')) {
            $this->imageValidator->validateImage(
                $request->file('image'),
                ImageValidationService::TYPE_BANNER
            );
        }

        // Update banner logic here...

        return redirect()->back()->with('success', 'Banner updated successfully!');
    }
}