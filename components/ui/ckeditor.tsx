"use client";

import { useEffect, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadAdapterPlugin } from './upload-adapter';
import { ImageFromUrlPlugin } from './image-from-url-plugin';
import { useTheme } from 'next-themes';

interface CKEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
}

const CKEditorField = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className = "",
  minHeight = "400px"
}: CKEditorProps) => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, resolvedTheme } = useTheme();
  
  // After hydration, we can safely access theme information
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Update editor theme when website theme changes
  useEffect(() => {
    if (!mounted) return;
    
    if (containerRef.current) {
      const editorContainer = containerRef.current;
      const currentTheme = theme === 'system' ? resolvedTheme : theme;
      
      if (currentTheme === 'dark') {
        editorContainer.classList.add('ck-dark-theme');
      } else {
        editorContainer.classList.remove('ck-dark-theme');
      }
    }
  }, [theme, resolvedTheme, mounted]);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'imageFromUrl',
        'blockQuote',
        'insertTable',
        'undo',
        'redo'
      ]
    },
    language: 'vi',
    image: {
      toolbar: [
        'imageTextAlternative',
        'imageStyle:inline',
        'imageStyle:block',
        'imageStyle:side'
      ]
    },
    table: {
      contentToolbar: [
        'tableColumn',
        'tableRow',
        'mergeTableCells'
      ]
    },
    placeholder: placeholder,
    extraPlugins: [UploadAdapterPlugin, ImageFromUrlPlugin],
  };

  // Define styles as a string for the CKEditor
  const customStyles = `
    .ck-editor__editable {
      min-height: ${minHeight};
      max-height: 800px;
      overflow-y: auto;
    }
    
    /* Force dark theme when .ck-dark-theme is present */
    .ck-dark-theme .ck.ck-editor__main > .ck-editor__editable {
      background-color: #1e1e2e;
      color: #f8f9fa;
      border-color: #313244;
    }
    
    .ck-dark-theme .ck.ck-toolbar {
      background-color: #1e1e2e;
      border-color: #313244;
    }
    
    .ck-dark-theme .ck.ck-button {
      color: #f8f9fa;
    }
    
    .ck-dark-theme .ck.ck-button:not(.ck-disabled):hover,
    .ck-dark-theme .ck.ck-button.ck-on {
      color: #f8f9fa;
      background-color: #313244;
    }
    
    .ck-dark-theme .ck.ck-dropdown .ck-dropdown__panel {
      background-color: #1e1e2e;
      border-color: #313244;
    }
    
    .ck-dark-theme .ck.ck-dropdown .ck-dropdown__panel .ck-list__item .ck-button:hover:not(.ck-disabled) {
      background-color: #313244;
    }
    
    .ck-dark-theme .ck.ck-list__item .ck-button:hover:not(.ck-disabled) {
      background-color: #313244;
    }
    
    .ck-dark-theme .ck.ck-list__item .ck-button.ck-on {
      background-color: #45475a;
      color: #f8f9fa;
    }
    
    .ck-dark-theme .ck.ck-input {
      background-color: #1e1e2e;
      border-color: #313244;
      color: #f8f9fa;
    }
    
    .ck-dark-theme .ck.ck-dropdown__panel {
      background-color: #1e1e2e;
      border-color: #313244;
    }
    
    .ck-dark-theme .ck.ck-labeled-field__label {
      color: #f8f9fa;
    }
    
    .ck-dark-theme .ck.ck-list {
      background-color: #1e1e2e;
      border-color: #313244;
    }
    
    .ck-dark-theme .ck.ck-button.ck-disabled {
      color: #64748b;
    }

    .ck.ck-editor__top .ck-sticky-panel .ck-sticky-panel__content {
      border: solid var(--ck-color-base-border);
      border-width: 1px;
    }
  `;

  // Don't render editor until we have mounted
  if (!mounted) {
    return <div className={className} style={{ minHeight }}></div>;
  }

  return (
    <>
      <style>{customStyles}</style>
      {editorLoaded && (
        <div className={className} ref={containerRef}>
          <CKEditor
            editor={ClassicEditor as any}
            data={value}
            config={editorConfig}
            onReady={(editor) => {
              editorRef.current = editor;
              // Apply theme immediately after editor is initialized
              const currentTheme = theme === 'system' ? resolvedTheme : theme;
              if (currentTheme === 'dark' && containerRef.current) {
                containerRef.current.classList.add('ck-dark-theme');
              }
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              onChange(data);
            }}
          />
        </div>
      )}
    </>
  );
};

export { CKEditorField }; 