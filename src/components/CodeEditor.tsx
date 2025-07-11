import { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  readOnly?: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  height = "300px",
  readOnly = false
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Create editor
      const editor = monaco.editor.create(editorRef.current, {
        value,
        language,
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        readOnly,
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on',
        lineNumbers: 'on',
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
        },
      });

      // Set up change event handler
      editor.onDidChangeModelContent(() => {
        const newValue = editor.getValue();
        onChange(newValue);
      });

      // Store editor instance
      monacoEditorRef.current = editor;

      // Cleanup function
      return () => {
        editor.dispose();
      };
    }
  // We only want to recreate the editor when the container ref changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorRef.current]);

  // Update editor value when prop changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      const currentValue = monacoEditorRef.current.getValue();
      if (value !== currentValue) {
        monacoEditorRef.current.setValue(value);
      }
    }
  }, [value]);

  // Update language when prop changes
  useEffect(() => {
    if (monacoEditorRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, language);
      }
    }
  }, [language]);

  return (
    <div 
      ref={editorRef} 
      style={{ 
        width: '100%', 
        height: height,
        border: '1px solid #e2e8f0',
        borderRadius: '0.375rem',
      }}
    />
  );
} 