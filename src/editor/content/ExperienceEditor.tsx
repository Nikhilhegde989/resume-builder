import { useState } from 'react';
import { useResumeStore } from '../../store';
import { Field, TextInput, Checkbox, BulletEditor } from '../FormControls';
import type { ExperienceData, ExperienceItem } from '../../types';

interface ItemEditorProps {
  item: ExperienceItem;
  sectionId: string;
  onRemove: () => void;
}

function ItemEditor({ item, sectionId, onRemove }: ItemEditorProps) {
  const [open, setOpen] = useState(true);
  const update = useResumeStore(s => s.updateExperienceItem);
  const upd = (p: Partial<ExperienceItem>) => update(sectionId, item.id, p);

  const label = [item.role, item.company].filter(Boolean).join(' @ ') || 'New Position';

  return (
    <div className="sub-item">
      <div className="sub-item-header" onClick={() => setOpen(o => !o)}>
        <span className="sub-item-arrow">{open ? '▾' : '▸'}</span>
        <span className="sub-item-label">{label}</span>
        <button
          type="button"
          className="icon-btn danger"
          onClick={e => { e.stopPropagation(); onRemove(); }}
          title="Remove"
        >
          ×
        </button>
      </div>

      {open && (
        <div className="sub-item-body">
          <Field label="Role / Job title">
            <TextInput value={item.role} onChange={v => upd({ role: v })} placeholder="Software Engineer" />
          </Field>
          <Field label="Company">
            <TextInput value={item.company} onChange={v => upd({ company: v })} placeholder="Company Name" />
          </Field>
          <div className="two-col">
            <Field label="Start date">
              <TextInput value={item.startDate} onChange={v => upd({ startDate: v })} placeholder="Jan 2022" />
            </Field>
            <Field label="End date">
              <TextInput value={item.endDate} onChange={v => upd({ endDate: v })} placeholder="Dec 2023" />
            </Field>
          </div>
          <Checkbox
            label="Currently working here"
            checked={item.current}
            onChange={v => upd({ current: v })}
          />
          <Field label="Location">
            <TextInput value={item.location} onChange={v => upd({ location: v })} placeholder="City, State" />
          </Field>
          <Field label="Bullet points">
            <BulletEditor
              bullets={item.bullets}
              onChange={bullets => upd({ bullets })}
              placeholder="Describe an achievement or responsibility..."
            />
          </Field>
        </div>
      )}
    </div>
  );
}

interface Props { sectionId: string }

export function ExperienceEditor({ sectionId }: Props) {
  const data = useResumeStore(s =>
    s.resume.sections.find(sec => sec.id === sectionId)!.data as ExperienceData
  );
  const addItem = useResumeStore(s => s.addExperienceItem);
  const removeItem = useResumeStore(s => s.removeExperienceItem);

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
        + Add position
      </button>
    </div>
  );
}
