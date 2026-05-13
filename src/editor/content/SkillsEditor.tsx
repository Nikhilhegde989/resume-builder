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
import { Field, Select } from '../FormControls';
import type { SkillsData, SkillCategory } from '../../types';

interface RowProps {
  cat: SkillCategory;
  sectionId: string;
  showCategory: boolean;
}

function SortableSkillRow({ cat, sectionId, showCategory }: RowProps) {
  const updateCat = useResumeStore(s => s.updateSkillCategory);
  const removeCat = useResumeStore(s => s.removeSkillCategory);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: cat.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="skill-row">
      <button type="button" className="drag-handle" {...attributes} {...listeners} title="Drag to reorder">
        ⠿
      </button>
      {showCategory && (
        <input
          type="text"
          className="form-input skill-cat-input"
          value={cat.category}
          onChange={e => updateCat(sectionId, cat.id, { category: e.target.value })}
          placeholder="Category"
        />
      )}
      <input
        type="text"
        className="form-input skill-skills-input"
        value={cat.skills}
        onChange={e => updateCat(sectionId, cat.id, { skills: e.target.value })}
        placeholder="Skill 1, Skill 2, Skill 3"
      />
      <button type="button" className="icon-btn danger" onClick={() => removeCat(sectionId, cat.id)} title="Remove">
        ×
      </button>
    </div>
  );
}

interface Props { sectionId: string }

export function SkillsEditor({ sectionId }: Props) {
  const data = useResumeStore(s =>
    s.resume.sections.find(sec => sec.id === sectionId)!.data as SkillsData
  );
  const update = useResumeStore(s => s.updateSectionData);
  const addCat = useResumeStore(s => s.addSkillCategory);
  const reorder = useResumeStore(s => s.reorderSkillCategories);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = data.categories.findIndex(c => c.id === active.id);
      const newIdx = data.categories.findIndex(c => c.id === over.id);
      reorder(sectionId, arrayMove(data.categories, oldIdx, newIdx));
    }
  };

  return (
    <div>
      <Field label="Layout">
        <Select
          value={data.layout}
          onChange={v => update(sectionId, { layout: v })}
          options={[
            { value: 'categories', label: 'Category: Skills (e.g. Languages: Python, Go)' },
            { value: 'list', label: 'Single list (all skills combined)' },
          ]}
        />
      </Field>

      <div className="subsection-title" style={{ marginTop: 10 }}>Skill groups</div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={data.categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {data.categories.map(cat => (
            <SortableSkillRow
              key={cat.id}
              cat={cat}
              sectionId={sectionId}
              showCategory={data.layout === 'categories'}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button type="button" className="btn-add" onClick={() => addCat(sectionId)}>
        + Add {data.layout === 'categories' ? 'category' : 'group'}
      </button>
    </div>
  );
}
