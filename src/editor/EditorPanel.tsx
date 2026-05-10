import { useState } from 'react';
import { SectionsList } from './SectionsList';
import { GlobalStylesEditor } from './GlobalStylesEditor';

type Tab = 'sections' | 'design';

export function EditorPanel() {
  const [tab, setTab] = useState<Tab>('sections');

  return (
    <div className="editor-panel">
      <div className="editor-tabs">
        <button
          className={`editor-tab ${tab === 'sections' ? 'editor-tab-active' : ''}`}
          onClick={() => setTab('sections')}
        >
          Sections
        </button>
        <button
          className={`editor-tab ${tab === 'design' ? 'editor-tab-active' : ''}`}
          onClick={() => setTab('design')}
        >
          Design
        </button>
      </div>

      <div className="editor-scroll">
        {tab === 'sections' && <SectionsList />}
        {tab === 'design' && <GlobalStylesEditor />}
      </div>
    </div>
  );
}
