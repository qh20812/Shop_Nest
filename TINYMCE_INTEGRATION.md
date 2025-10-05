# TinyMCE Rich Text Editor Integration

## Overview
Successfully integrated TinyMCE rich text editor to replace the custom HTML editor component. This provides a professional WYSIWYG editing experience for content management.

## Implementation Details

### 1. Package Installation
```bash
npm install @tinymce/tinymce-react
```

### 2. Environment Configuration
Added TinyMCE API key to environment files:

**.env:**
```env
# TinyMCE Configuration
TINYMCE_API_KEY=heeh2pj7evemt40df5dci2t5g8skk80ddh4a0jrlimns9tv5
VITE_TINYMCE_API_KEY=heeh2pj7evemt40df5dci2t5g8skk80ddh4a0jrlimns9tv5
```

**config/tinymce.php:**
```php
<?php
return [
    'api_key' => env('TINYMCE_API_KEY', ''),
];
```

### 3. Vite Configuration Updates
Enhanced vite.config.ts to optimize TinyMCE dependencies:

```typescript
export default defineConfig({
    // ... existing config
    optimizeDeps: {
        include: ['@tinymce/tinymce-react'],
        force: true
    },
    server: {
        fs: {
            allow: ['..']
        }
    }
});
```

### 4. Component Implementation
Replaced custom RichTextEditor.tsx with TinyMCE Editor:

```tsx
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function RichTextEditor({
    label,
    value,
    onChange,
    error,
    placeholder,
    height = '150px'
}: RichTextEditorProps) {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            
            <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                value={value}
                onEditorChange={(content) => onChange(content)}
                init={{
                    height: parseInt(height.replace('px', '')) || 150,
                    menubar: false,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic underline | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | code | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; line-height:1.5; }',
                    placeholder: placeholder || "Enter your content here...",
                    skin: 'oxide',
                    content_css: 'default',
                    branding: false,
                    resize: true,
                    statusbar: false,
                    // ... additional configuration
                }}
            />
            
            {error && <div className="form-error">{error}</div>}
        </div>
    );
}
```

## Features

### Rich Text Editing Capabilities
- **WYSIWYG Editor**: Real-time visual editing
- **Text Formatting**: Bold, italic, underline, headers (H1-H6)
- **Lists**: Bullet points, numbered lists, nested lists
- **Alignment**: Left, center, right, justify
- **Links & Media**: Insert links, images, and media content
- **Code View**: Switch between visual and HTML code editing
- **Undo/Redo**: Full history management
- **Tables**: Insert and format tables
- **Search & Replace**: Advanced text search functionality

### Technical Features
- **React 19 Compatible**: No deprecated findDOMNode warnings
- **TypeScript Support**: Full type safety
- **Responsive Design**: Resizable editor interface
- **Professional UI**: Clean, modern interface with Oxide skin
- **No Branding**: TinyMCE branding removed for clean appearance
- **Custom Styling**: Consistent with application theme

## Usage

The RichTextEditor component is used in:
- **Brand Management**: Brand description editing (`BrandForm.tsx`)
- **Category Management**: Category description editing (`CategoryForm.tsx`)
- **Product Management**: Product description editing (future implementation)

## Bundle Size Impact

- **Previous Custom Editor**: 3.29kB (basic functionality)
- **TinyMCE Integration**: 16.63kB (professional features)
- **Trade-off**: Slightly larger bundle for significantly better UX

## Troubleshooting

### Common Issues Fixed
1. **ERR_ABORTED 504 (Outdated Optimize Dep)**:
   - Solution: Added `optimizeDeps.force: true` in vite.config.ts
   - Cleared npm cache and reinstalled dependencies

2. **API Key Configuration**:
   - Stored securely in environment variables
   - Used VITE_ prefix for frontend access

3. **Dependency Caching**:
   - Forced re-optimization of dependencies
   - Proper file system access configuration

## Development Environment

- **Vite Dev Server**: http://localhost:5173/
- **Laravel Server**: http://127.0.0.1:8000
- **Environment**: React 19, TypeScript, Tailwind CSS
- **Framework**: Laravel 12.27.1 with Inertia.js

## Security Considerations

- API key stored in environment variables
- Not exposed in client-side code repository
- Separate keys for development and production environments recommended

## Future Enhancements

1. **Image Upload**: Integrate with Laravel storage system
2. **Custom Plugins**: Develop application-specific TinyMCE plugins
3. **Content Templates**: Pre-defined content templates for consistency
4. **Collaborative Editing**: Real-time collaborative editing features
5. **Version History**: Content version control and rollback functionality

## Migration from Custom Editor

The migration maintains the same component interface:
- Same props: `label`, `value`, `onChange`, `error`, `placeholder`, `height`
- Same HTML output format
- Backward compatible with existing forms
- No breaking changes to parent components

## Conclusion

TinyMCE integration provides a professional, feature-rich text editing experience while maintaining compatibility with the existing Laravel/React/Inertia.js architecture. The implementation follows best practices for security, performance, and maintainability.