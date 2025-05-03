"use client";

import { useEffect, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
  const editorRef = useRef<any>(null);

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
  };

  const customStyles = `
    .ck-editor__editable {
      min-height: ${minHeight};
      max-height: 800px;
      overflow-y: auto;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      {editorLoaded && (
        <div className={className}>
          <CKEditor
            editor={ClassicEditor}
            data={value}
            config={editorConfig}
            onReady={(editor) => {
              editorRef.current = editor;
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