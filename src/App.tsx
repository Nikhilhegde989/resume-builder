import { useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import { useResumeStore } from './store';
import { EditorPanel } from './editor/EditorPanel';
import { PreviewPanel } from './preview/PreviewPanel';
import { ResumeDocument } from './pdf/ResumeDocument';
import type { ResumeData } from './types';

async function downloadPDF(resume: ResumeData) {
  const blob = await pdf(<ResumeDocument resume={resume} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.pdf';
  a.click();
  URL.revokeObjectURL(url);
}

function exportJSON(resume: ResumeData) {
  const json = JSON.stringify(resume, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'resume.json';
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const resume = useResumeStore(s => s.resume);
  const importResume = useResumeStore(s => s.importResume);
  const resetToDefault = useResumeStore(s => s.resetToDefault);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string) as ResumeData;
        if (data.version === 1 && data.sections && data.globalStyles) {
          importResume(data);
        } else {
          alert('Invalid resume file format.');
        }
      } catch {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (confirm('Reset everything to the default resume? This will overwrite your current data.')) {
      resetToDefault();
    }
  };

  return (
    <div className="app">
      {/* Toolbar */}
      <header className="toolbar">
        <span className="toolbar-logo">📄</span>
        <span className="toolbar-title">Resume Builder</span>

        <div className="toolbar-actions">
          <button
            type="button"
            className="toolbar-btn toolbar-btn-secondary"
            onClick={() => fileInputRef.current?.click()}
            title="Import a previously exported resume.json"
          >
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: 'none' }}
          />

          <button
            type="button"
            className="toolbar-btn toolbar-btn-secondary"
            onClick={() => exportJSON(resume)}
            title="Export resume data as JSON (backup)"
          >
            Export JSON
          </button>

          <button
            type="button"
            className="toolbar-btn toolbar-btn-secondary"
            onClick={handleReset}
            title="Reset to default sample resume"
          >
            Reset
          </button>

          <button
            type="button"
            className="toolbar-btn toolbar-btn-primary"
            onClick={() => downloadPDF(resume)}
          >
            ↓ Export PDF
          </button>
        </div>
      </header>

      {/* Main split layout */}
      <main className="main-layout">
        <EditorPanel />
        <PreviewPanel />
      </main>
    </div>
  );
}
