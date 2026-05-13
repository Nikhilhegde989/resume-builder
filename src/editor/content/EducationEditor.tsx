import { useState } from 'react';
import { useResumeStore } from '../../store';
import { Field, TextInput, Checkbox, BulletEditor } from '../FormControls';
import type { EducationData, EducationItem } from '../../types';

interface ItemEditorProps {
  item: EducationItem;
  sectionId: string;
  onRemove: () => void;
}

function ItemEditor({ item, sectionId, onRemove }: ItemEditorProps) {
  const [open, setOpen] = useState(true);
  const update = useResumeStore(s => s.updateEducationItem);
  const upd = (p: Partial<EducationItem>) => update(sectionId, item.id, p);

  const label = [item.institution, item.degree].filter(Boolean).join(' – ') || 'New Education';

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
          <Field label="Institution">
            <TextInput value={item.institution} onChange={v => upd({ institution: v })} placeholder="University Name" />
          </Field>
          <div className="two-col">
            <Field label="Degree">
              <TextInput value={item.degree} onChange={v => upd({ degree: v })} placeholder="B.S." />
            </Field>
            <Field label="Field of study">
              <TextInput value={item.field} onChange={v => upd({ field: v })} placeholder="Computer Science" />
            </Field>
          </div>
          <div className="two-col">
            <Field label="Start date">
              <TextInput value={item.startDate} onChange={v => upd({ startDate: v })} placeholder="Sep 2015" />
            </Field>
            <Field label="End date">
              <TextInput value={item.endDate} onChange={v => upd({ endDate: v })} placeholder="May 2019" />
            </Field>
          </div>
          <Checkbox label="Currently attending" checked={item.current} onChange={v => upd({ current: v })} />
          <div className="two-col">
            <Field label="Location">
              <TextInput value={item.location} onChange={v => upd({ location: v })} placeholder="City, ST" />
            </Field>
            <Field label="GPA / Score">
              <TextInput value={item.gpa} onChange={v => upd({ gpa: v })} placeholder="GPA: 3.8 or 84%" />
            </Field>
          </div>
          <Field label="Bullet points (optional)">
            <BulletEditor bullets={item.bullets} onChange={bullets => upd({ bullets })} />
          </Field>
        </div>
      )}
    </div>
  );
}

interface Props { sectionId: string }

export function EducationEditor({ sectionId }: Props) {
  const data = useResumeStore(s =>
    s.resume.sections.find(sec => sec.id === sectionId)!.data as EducationData
  );
  const addItem = useResumeStore(s => s.addEducationItem);
  const removeItem = useResumeStore(s => s.removeEducationItem);

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
        + Add education
      </button>
    </div>
  );
}
