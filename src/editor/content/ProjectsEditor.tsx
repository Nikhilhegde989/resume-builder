import { useState } from 'react';
import { useResumeStore } from '../../store';
import { Field, TextInput, BulletEditor } from '../FormControls';
import type { ProjectsData, ProjectItem } from '../../types';

interface ItemEditorProps {
  item: ProjectItem;
  sectionId: string;
  onRemove: () => void;
}

function ItemEditor({ item, sectionId, onRemove }: ItemEditorProps) {
  const [open, setOpen] = useState(true);
  const update = useResumeStore(s => s.updateProjectItem);
  const upd = (p: Partial<ProjectItem>) => update(sectionId, item.id, p);

  const label = item.name || 'New Project';

  return (
    <div className="sub-item">
      <div className="sub-item-header" onClick={() => setOpen(o => !o)}>
        <span className="sub-item-arrow">{open ? '▾' : '▸'}</span>
        <span className="sub-item-label">{label}</span>
        <button
          type="button"
          className="icon-btn danger"
          onClick={e => { e.stopPropagation(); onRemove(); }}
        >
          ×
        </button>
      </div>

      {open && (
        <div className="sub-item-body">
          <Field label="Project name">
            <TextInput value={item.name} onChange={v => upd({ name: v })} placeholder="My Project" />
          </Field>
          <Field label="Tech stack (comma separated)">
            <TextInput value={item.tech} onChange={v => upd({ tech: v })} placeholder="TypeScript, React, Node.js" />
          </Field>
          <Field label="Link">
            <TextInput value={item.link} onChange={v => upd({ link: v })} placeholder="github.com/you/project" />
          </Field>
          <Field label="Description">
            <TextInput value={item.description} onChange={v => upd({ description: v })} multiline rows={2} placeholder="Brief description..." />
          </Field>
          <Field label="Bullet points">
            <BulletEditor bullets={item.bullets} onChange={bullets => upd({ bullets })} />
          </Field>
        </div>
      )}
    </div>
  );
}

interface Props { sectionId: string }

export function ProjectsEditor({ sectionId }: Props) {
  const data = useResumeStore(s =>
    s.resume.sections.find(sec => sec.id === sectionId)!.data as ProjectsData
  );
  const addItem = useResumeStore(s => s.addProjectItem);
  const removeItem = useResumeStore(s => s.removeProjectItem);

  return (
    <div>
      {data.items.map(item => (
        <ItemEditor
          key={item.id}
          item={item}
          sectionId={sectionId}
          onRemove={() => removeItem(sectionId, item.id)}
        />
      ))}
      <button type="button" className="btn-add" onClick={() => addItem(sectionId)}>
        + Add project
      </button>
    </div>
  );
}
