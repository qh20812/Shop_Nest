import { Editor } from '@tinymce/tinymce-react';
import { TINYMCE_CONFIG } from '../../utils/tinymce';

interface RichTextEditorProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    placeholder?: string;
    height?: string;
}

export default function RichTextEditor({ label, value, onChange, error, placeholder, height = '300px' }: RichTextEditorProps) {
    return (
        <div className="sn-field">
            {label && <label className="sn-field__label">{label}</label>}

            <div className="sn-rich-text">
                <Editor
                    apiKey={TINYMCE_CONFIG.apiKey}
                    value={value}
                    onEditorChange={(content) => onChange(content)}
                    init={{
                        ...TINYMCE_CONFIG.getDefaultConfig(parseInt(height.replace('px', '')) || 150),
                        placeholder: placeholder || 'Enter your content here...',
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        setup: (editor: any) => {
                            editor.on('init', () => {
                                const editorBody = editor.getBody();
                                if (editorBody) {
                                    editorBody.style.fontSize = '14px';
                                    editorBody.style.lineHeight = '1.5';
                                }
                            });
                        },
                    }}
                />
            </div>

            {error && (
                <div className="sn-field__error" role="alert">
                    {error}
                </div>
            )}
        </div>
    );
}
