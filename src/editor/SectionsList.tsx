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
import { useResumeStore } from '../store';
import { SectionEditor } from './SectionEditor';
import type { Section, SectionType } from '../types';

const SECTION_ICONS: Record<SectionType, string> = {
  header: '👤',
  summary: '📝',
  experience: '💼',
  education: '🎓',
  skills: '⚡',
  projects: '🚀',
  custom: '✨',
};

const ADD_SECTION_TYPES: { type: SectionType; label: string }[] = [
  { type: 'experience', label: 'Experience' },
  { type: 'education', label: 'Education' },
  { type: 'skills', label: 'Skills' },
  { type: 'projects', label: 'Projects' },
  { type: 'custom', label: 'Custom' },
  { type: 'summary', label: 'Summary' },
];

interface SortableItemProps {
  section: Section;
}

function SortableItem({ section }: SortableItemProps) {
  const [expanded, setExpanded] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: section.id });

  const toggleVisibility = useResumeStore(s => s.toggleVisibility);
  const removeSection = useResumeStore(s => s.removeSection);
  const duplicateSection = useResumeStore(s => s.duplicateSection);
  const updateSectionTitle = useResumeStore(s => s.updateSectionTitle);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleVal, setTitleVal] = useState(section.title);

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : undefined,
  };

  const commitTitle = () => {
    updateSectionTitle(section.id, titleVal || section.title);
    setEditingTitle(false);
  };

  return (
    <div ref={setNodeRef} style={style} className={`sortable-item ${expanded ? 'sortable-item-expanded' : ''}`}>
      <div className="sortable-item-header">
        {/* Drag handle - only this triggers drag */}
        <button
          type="button"
          className="drag-handle"
          {...attributes}
          {...listeners}
          title="Drag to reorder"
        >
          ⠿
        </button>

        {/* Visibility toggle */}
        <button
          type="button"
          className={`icon-btn visibility-btn ${!section.visible ? 'dim' : ''}`}
          onClick={() => toggleVisibility(section.id)}
          title={section.visible ? 'Hide section' : 'Show section'}
        >
          {section.visible ? '👁' : '🚫'}
        </button>

        {/* Section icon */}
        <span className="section-icon">{SECTION_ICONS[section.type]}</span>

        {/* Title (double-click to edit) */}
        {editingTitle ? (
          <input
            type="text"
            className="title-input"
            value={titleVal}
            onChange={e => setTitleVal(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={e => { if (e.key === 'Enter') commitTitle(); if (e.key === 'Escape') setEditingTitle(false); }}
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span
            className="section-title-text"
            onDoubleClick={() => { setTitleVal(section.title); setEditingTitle(true); }}
            title="Double-click to rename"
          >
            {section.title}
          </span>
        )}

        <div className="section-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => duplicateSection(section.id)}
            title="Duplicate section"
          >
            ⎘
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => removeSection(section.id)}
            title="Delete section"
          >
            ×
          </button>
          <button
            type="button"
            className="expand-btn"
            onClick={() => setExpanded(o => !o)}
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="sortable-item-content">
          <SectionEditor sectionId={section.id} />
        </div>
      )}
    </div>
  );
}

export function SectionsList() {
  const sections = useResumeStore(s => s.resume.sections);
  const reorderSections = useResumeStore(s => s.reorderSections);
  const addSection = useResumeStore(s => s.addSection);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIdx = sections.findIndex(s => s.id === active.id);
      const newIdx = sections.findIndex(s => s.id === over.id);
      reorderSections(arrayMove(sections, oldIdx, newIdx));
    }
  };

  return (
    <div className="sections-list">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {sections.map(section => (
            <SortableItem key={section.id} section={section} />
          ))}
        </SortableContext>
      </DndContext>

      <div className="add-section-area">
        <button
          type="button"
          className="btn-add-section"
          onClick={() => setShowAddMenu(o => !o)}
        >
          + Add Section
        </button>
        {showAddMenu && (
          <div className="add-section-menu">
            {ADD_SECTION_TYPES.map(({ type, label }) => (
              <button
                key={type}
                type="button"
                className="add-section-option"
                onClick={() => { addSection(type); setShowAddMenu(false); }}
              >
                {SECTION_ICONS[type]} {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
