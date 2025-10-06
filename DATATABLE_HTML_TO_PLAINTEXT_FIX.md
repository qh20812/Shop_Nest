# DataTable HTML to Plain Text Conversion Fix

## Issue Summary
Brand and Category DataTables were displaying HTML content (with tags like `<b>`, `<p>`, `<br>`, etc.) in the description preview, causing poor UI/UX with raw HTML tags showing instead of formatted text.

## Solution Implemented

### 1. Created HTML to Plain Text Helper Function
Added a utility function in both Brand and Category index files to convert HTML content to clean plain text while preserving line breaks:

```typescript
const htmlToPlainText = (html: string): string => {
    if (!html) return '';
    // Replace <br>, <p>, <li> with newline
    let text = html.replace(/<\/?(br|p|li)>/gi, '\n');
    // Remove all other HTML tags
    text = text.replace(/<[^>]+>/g, '');
    // Replace multiple newlines with single
    text = text.replace(/\n{2,}/g, '\n');
    // Decode HTML entities
    text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    return text.trim();
};
```

### 2. Updated Brand DataTable (Index.tsx)
**File**: `resources/js/pages/Admin/Brands/Index.tsx`

**Before**:
```tsx
{brand.description && (
    <div style={{ fontSize: "12px", color: "var(--dark-grey)" }}>
        {brand.description.length > 50 ? `${brand.description.substring(0, 50)}...` : brand.description}
    </div>
)}
```

**After**:
```tsx
{brand.description && (
    <div style={{ 
        fontSize: "12px", 
        color: "var(--dark-grey)", 
        whiteSpace: "pre-line",
        maxWidth: "300px",
        lineHeight: "1.4"
    }}>
        {(() => {
            const plainText = htmlToPlainText(brand.description);
            return plainText.length > 50 ? `${plainText.substring(0, 50)}...` : plainText;
        })()}
    </div>
)}
```

### 3. Updated Category DataTable (Index.tsx)
**File**: `resources/js/pages/Admin/Categories/Index.tsx`

**Before**:
```tsx
{
    header: t("Description"), 
    cell: (category: Category) => {
        const description = category.description?.[locale as keyof typeof category.description] || category.description?.['en'];
        return description || t('No description');
    }
},
```

**After**:
```tsx
{
    header: t("Description"), 
    cell: (category: Category) => {
        const description = category.description?.[locale as keyof typeof category.description] || category.description?.['en'];
        if (!description) return t('No description');
        
        const plainText = htmlToPlainText(description);
        const truncated = plainText.length > 50 ? `${plainText.substring(0, 50)}...` : plainText;
        
        return (
            <div style={{ 
                whiteSpace: "pre-line",
                maxWidth: "300px",
                lineHeight: "1.4",
                fontSize: "14px"
            }}>
                {truncated}
            </div>
        );
    }
},
```

## Key Features

### 1. HTML Tag Removal
- Strips all HTML tags (`<b>`, `<i>`, `<strong>`, `<em>`, etc.)
- Converts structural tags (`<p>`, `<br>`, `<li>`) to line breaks
- Removes formatting while preserving content structure

### 2. HTML Entity Decoding
- Converts common HTML entities back to readable characters:
  - `&amp;` → `&`
  - `&lt;` → `<`
  - `&gt;` → `>`
  - `&quot;` → `"`
  - `&#39;` → `'`

### 3. Line Break Preservation
- Uses `whiteSpace: "pre-line"` CSS property
- Maintains paragraph breaks and line breaks from original HTML
- Provides better readability without HTML formatting

### 4. Text Truncation
- Limits preview to 50 characters
- Adds "..." for longer descriptions
- Applies truncation to plain text (not HTML)

### 5. Responsive Design
- Sets `maxWidth: "300px"` to prevent table layout issues
- Uses `lineHeight: "1.4"` for better text readability
- Maintains consistent font sizes

## Benefits

### 1. Improved UI/UX
- ✅ Clean, readable text previews
- ✅ No more raw HTML tags in table cells
- ✅ Proper line breaks and text flow
- ✅ Consistent visual appearance

### 2. Better Data Presentation
- ✅ Preserves meaningful content structure
- ✅ Maintains readability in compact table format
- ✅ Handles multilingual content (Categories)
- ✅ Graceful handling of empty descriptions

### 3. Maintainable Code
- ✅ Reusable helper function
- ✅ Clean separation of concerns
- ✅ TypeScript type safety
- ✅ Consistent implementation across pages

## Testing Results

- ✅ **Build Success**: npm run build completed without errors
- ✅ **Type Safety**: No TypeScript compilation errors
- ✅ **Functionality**: HTML content properly converted to plain text
- ✅ **UI**: Clean table appearance without HTML tags

## Files Modified

1. **resources/js/pages/Admin/Brands/Index.tsx**
   - Added `htmlToPlainText` helper function
   - Updated brand description cell rendering
   - Enhanced styling for better text display

2. **resources/js/pages/Admin/Categories/Index.tsx**
   - Added `htmlToPlainText` helper function
   - Updated category description cell rendering
   - Added proper styling and multilingual support

## Usage

The fix automatically applies to:
- **Brand Management**: All brand descriptions in the index table
- **Category Management**: All category descriptions in the index table
- **Rich Text Editor**: Content created with TinyMCE will display cleanly in tables

## Future Considerations

1. **Utility Function**: Consider moving `htmlToPlainText` to a shared utility file
2. **Configuration**: Make truncation length configurable
3. **Performance**: Add memoization for repeated HTML processing
4. **Internationalization**: Enhance support for different text directions (RTL/LTR)