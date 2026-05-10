import { useResumeStore } from '../../store';
import { Field, TextInput, Select } from '../FormControls';
import type { SkillsData, SkillCategory } from '../../types';

interface Props { sectionId: string }

export function SkillsEditor({ sectionId }: Props) {
  const data = useResumeStore(s =>
    s.resume.sections.find(sec => sec.id === sectionId)!.data as SkillsData
  );
  const update = useResumeStore(s => s.updateSectionData);
  const addCat = useResumeStore(s => s.addSkillCategory);
  const removeCat = useResumeStore(s => s.removeSkillCategory);
  const updateCat = useResumeStore(s => s.updateSkillCategory);

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

      {data.categories.map((cat: SkillCategory) => (
        <div key={cat.id} className="skill-row">
          {data.layout === 'categories' && (
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
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => removeCat(sectionId, cat.id)}
            title="Remove"
          >
            ×
          </button>
        </div>
      ))}

      <button type="button" className="btn-add" onClick={() => addCat(sectionId)}>
        + Add {data.layout === 'categories' ? 'category' : 'group'}
      </button>
    </div>
  );
}
