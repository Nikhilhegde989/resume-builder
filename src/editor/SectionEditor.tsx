import { useState } from 'react';
import { useResumeStore } from '../store';
import { SectionStylesEditor } from './SectionStylesEditor';
import { HeaderEditor } from './content/HeaderEditor';
import { SummaryEditor } from './content/SummaryEditor';
import { ExperienceEditor } from './content/ExperienceEditor';
import { EducationEditor } from './content/EducationEditor';
import { SkillsEditor } from './content/SkillsEditor';
import { ProjectsEditor } from './content/ProjectsEditor';
import { CustomEditor } from './content/CustomEditor';
import type { SectionType } from '../types';

const CONTENT_EDITORS: Record<SectionType, React.ComponentType<{ sectionId: string }>> = {
  header: HeaderEditor,
  summary: SummaryEditor,
  experience: ExperienceEditor,
  education: EducationEditor,
  skills: SkillsEditor,
  projects: ProjectsEditor,
  custom: CustomEditor,
};

interface Props {
  sectionId: string;
}

type Tab = 'content' | 'styles';

export function SectionEditor({ sectionId }: Props) {
  const [tab, setTab] = useState<Tab>('content');
  const section = useResumeStore(s => s.resume.sections.find(sec => sec.id === sectionId));

  if (!section) return null;

  const ContentEditor = CONTENT_EDITORS[section.type];

  return (
    <div className="section-editor">
      <div className="section-editor-tabs">
        <button
          className={`editor-tab ${tab === 'content' ? 'editor-tab-active' : ''}`}
          onClick={() => setTab('content')}
        >
          Content
        </button>
        <button
          className={`editor-tab ${tab === 'styles' ? 'editor-tab-active' : ''}`}
          onClick={() => setTab('styles')}
        >
          Styles
        </button>
      </div>

      <div className="section-editor-body">
        {tab === 'content' && <ContentEditor sectionId={sectionId} />}
        {tab === 'styles' && <SectionStylesEditor sectionId={sectionId} />}
      </div>
    </div>
  );
}
