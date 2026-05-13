import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useResumeStore } from '../../store';
import { Field, TextInput, BulletEditor, Checkbox } from '../FormControls';
import type { CustomData, CustomItem } from '../../types';

interface ItemEditorProps {
  item: CustomItem;
  sectionId: string;
  onRemove: () => void;
}

function SortableItemEditor({ item, sectionId, onRemove }: ItemEditorProps) {
  const [open, setOpen] = useState(true);
  const update = useResumeStore(s => s.updateCustomItem);
  const upd = (p: Partial<CustomItem>) => update(sectionId, item.id, p);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const label = item.title || 'New Item';

  return (
    <div ref={setNodeRef} style={style} className="sub-item">
      <div className="sub-item-header" onClick={() => setOpen(o => !o)}>
        <button
          type="button"
          className="drag-handle"
          {...attributes}
          {...listeners}
          onClick={e => e.stopPropagation()}
          title="Drag to reorder"
        >
          ⠿
        </button>
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
          <Field label="Location">
            <TextInput value={item.subtitle} onChange={v => upd({ subtitle: v })} placeholder="City, Conference, etc." />
          </Field>
          <Field label="Date">
            <TextInput value={item.date} onChange={v => upd({ date: v })} placeholder="2023" />
          </Field>
          <Field label="Link (optional)">
            <TextInput value={item.link ?? ''} onChange={v => upd({ link: v })} placeholder="https://..." />
          </Field>
          <Field label="Details (optional)">
            <TextInput value={item.content} onChange={v => upd({ content: v })} multiline rows={2} placeholder="Additional details..." />
          </Field>
          <Field label="Bullet points">
            <BulletEditor
              bullets={item.bullets ?? []}
              onChange={bullets => upd({ bullets })}
            />
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
  const section = useResumeStore(s => s.resume.sections.find(sec => sec.id === sectionId)!);
  const updateTitle = useResumeStore(s => s.updateSectionTitle);
  const updateData = useResumeStore(s => s.updateSectionData);
  const addItem = useResumeStore(s => s.addCustomItem);
  const removeItem = useResumeStore(s => s.removeCustomItem);
  const reorderItems = useResumeStore(s => s.reorderCustomItems);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = data.items.findIndex(i => i.id === active.id);
      const newIdx = data.items.findIndex(i => i.id === over.id);
      reorderItems(sectionId, arrayMove(data.items, oldIdx, newIdx));
    }
  };

  return (
    <div>
      <Field label="Section heading">
        <TextInput
          value={section.title}
          onChange={v => updateTitle(sectionId, v)}
          placeholder="Certifications, Awards, etc."
        />
      </Field>
      <Checkbox
        label="Show bullet before each item"
        checked={data.showItemBullet !== false}
        onChange={v => updateData(sectionId, { ...data, showItemBullet: v })}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
          {data.items.map(item => (
            <SortableItemEditor
              key={item.id}
              item={item}
              sectionId={sectionId}
              onRemove={() => removeItem(sectionId, item.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button type="button" className="btn-add" onClick={() => addItem(sectionId)}>
        + Add item
      </button>
    </div>
  );
}
