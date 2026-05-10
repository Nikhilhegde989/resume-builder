import { useState, useEffect } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { useResumeStore } from '../store';
import { ResumeDocument } from '../pdf/ResumeDocument';
import type { ResumeData } from '../types';

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function PreviewPanel() {
  const resume = useResumeStore(s => s.resume);
  const debouncedResume = useDebounce<ResumeData>(resume, 400);

  return (
    <div className="preview-panel">
      <PDFViewer width="100%" height="100%" showToolbar={false}>
        <ResumeDocument resume={debouncedResume} />
      </PDFViewer>
    </div>
  );
}
