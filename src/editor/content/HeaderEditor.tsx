import { useResumeStore } from '../../store';
import { Field, TextInput, NumberInput, ColorInput, Select } from '../FormControls';
import type { HeaderData, Alignment } from '../../types';

const ALIGNMENTS: { value: Alignment; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

interface Props { sectionId: string }

export function HeaderEditor({ sectionId }: Props) {
  const data = useResumeStore(s =>
    s.resume.sections.find(sec => sec.id === sectionId)!.data as HeaderData
  );
  const update = useResumeStore(s => s.updateSectionData);
  const upd = (p: Partial<HeaderData>) => update(sectionId, p);

  return (
    <div>
      <Field label="Full name">
        <TextInput value={data.name} onChange={v => upd({ name: v })} placeholder="Your Name" />
      </Field>
      <Field label="Professional title">
        <TextInput value={data.title} onChange={v => upd({ title: v })} placeholder="Software Engineer" />
      </Field>

      <div className="subsection-title" style={{ marginTop: 12 }}>Contact</div>
      <Field label="Email">
        <TextInput value={data.email} onChange={v => upd({ email: v })} placeholder="you@example.com" />
      </Field>
      <Field label="Phone">
        <TextInput value={data.phone} onChange={v => upd({ phone: v })} placeholder="+1 (555) 000-0000" />
      </Field>
      <Field label="Location">
        <TextInput value={data.location} onChange={v => upd({ location: v })} placeholder="City, State" />
      </Field>
      <Field label="LinkedIn URL">
        <TextInput value={data.linkedin} onChange={v => upd({ linkedin: v })} placeholder="linkedin.com/in/..." />
      </Field>
      <Field label="LinkedIn display as">
        <TextInput value={data.linkedinLabel} onChange={v => upd({ linkedinLabel: v })} placeholder="LinkedIn" />
      </Field>
      <Field label="Website URL">
        <TextInput value={data.website} onChange={v => upd({ website: v })} placeholder="github.com/you" />
      </Field>
      <Field label="Website display as">
        <TextInput value={data.websiteLabel} onChange={v => upd({ websiteLabel: v })} placeholder="www.yoursite.com" />
      </Field>
      <Field label="Separator">
        <TextInput value={data.separator} onChange={v => upd({ separator: v })} placeholder="  ·  " />
      </Field>

      <div className="subsection-title" style={{ marginTop: 12 }}>Styling</div>
      <Field label="Alignment">
        <Select<Alignment> value={data.alignment} onChange={v => upd({ alignment: v })} options={ALIGNMENTS} />
      </Field>
      <div className="two-col">
        <Field label="Name size (pt)">
          <NumberInput value={data.nameSize} onChange={v => upd({ nameSize: v })} min={12} max={60} />
        </Field>
        <Field label="Name color">
          <ColorInput value={data.nameColor} onChange={v => upd({ nameColor: v })} />
        </Field>
      </div>
      <div className="two-col">
        <Field label="Title size (pt)">
          <NumberInput value={data.titleSize} onChange={v => upd({ titleSize: v })} min={8} max={30} />
        </Field>
        <Field label="Title color">
          <ColorInput value={data.titleColor} onChange={v => upd({ titleColor: v })} />
        </Field>
      </div>
      <div className="two-col">
        <Field label="Contact size (pt)">
          <NumberInput value={data.contactSize} onChange={v => upd({ contactSize: v })} min={6} max={14} />
        </Field>
        <Field label="Contact color">
          <ColorInput value={data.contactColor} onChange={v => upd({ contactColor: v })} />
        </Field>
      </div>
    </div>
  );
}
