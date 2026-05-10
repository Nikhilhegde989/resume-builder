import { useState } from 'react';
import { useResumeStore } from '../../store';
import { Field, TextInput } from '../FormControls';
import type { CustomData, CustomItem } from '../../types';

interface ItemEditorProps {
  item: CustomItem;
  sectionId: string;
  onRemove: () => void;
}

function ItemEditor({ item, sectionId, onRemove }: ItemEditorProps) {
  const [open, setOpen] = useState(true);
  const update = useResumeStore(s => s.updateCustomItem);
  const upd = (p: Partial<CustomItem>) => update(sectionId, item.id, p);

  const label = item.title || 'New Item';

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
          <Field label="Title">
            <TextInput value={item.title} onChange={v => upd({ title: v })} placeholder="Award, Certificate, etc." />
          </Field>
          <Field label="Subtitle / Issuer">
            <TextInput value={item.subtitle} onChange={v => upd({ subtitle: v })} placeholder="Issuing organization" />
          </Field>
          <Field label="Date">
            <TextInput value={item.date} onChange={v => upd({ date: v })} placeholder="2023" />
          </Field>
          <Field label="Details (optional)">
            <TextInput value={item.content} onChange={v => upd({ content: v })} multiline rows={2} placeholder="Additional details..." />
          </Field>
        </div>
      )}
    </div>
  );
}

interface Props { sectionId: string }

export function CustomEditor({ sectionId }: Props) {
  const data = useResumeStore(s =>
    s.resume.sections.find(sec => sec.id === sectionId)!.data as CustomData
  );
  const addItem = useResumeStore(s => s.addCustomItem);
  const removeItem = useResumeStore(s => s.removeCustomItem);

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
        + Add item
      </button>
    </div>
  );
}
