import { useResumeStore } from '../store';
import { Field, NumberInput, ColorInput, Select, Checkbox } from './FormControls';
import type { FontFamily, PageSize } from '../types';

const FONTS: { value: FontFamily; label: string }[] = [
  { value: 'Helvetica', label: 'Helvetica (Sans-serif)' },
  { value: 'Times-Roman', label: 'Times Roman (Serif)' },
  { value: 'Courier', label: 'Courier (Monospace)' },
];

const PAGES: { value: PageSize; label: string }[] = [
  { value: 'LETTER', label: 'Letter (8.5 × 11 in)' },
  { value: 'A4', label: 'A4 (210 × 297 mm)' },
];

export function GlobalStylesEditor() {
  const g = useResumeStore(s => s.resume.globalStyles);
  const update = useResumeStore(s => s.updateGlobalStyles);

  return (
    <div className="section-block">
      <div className="subsection-title">Page</div>
      <Field label="Page size">
        <Select value={g.pageSize} onChange={v => update({ pageSize: v })} options={PAGES} />
      </Field>

      <div className="margin-grid">
        <Field label="Top (pt)">
          <NumberInput value={g.marginTop} onChange={v => update({ marginTop: v })} min={0} max={200} />
        </Field>
        <Field label="Right (pt)">
          <NumberInput value={g.marginRight} onChange={v => update({ marginRight: v })} min={0} max={200} />
        </Field>
        <Field label="Bottom (pt)">
          <NumberInput value={g.marginBottom} onChange={v => update({ marginBottom: v })} min={0} max={200} />
        </Field>
        <Field label="Left (pt)">
          <NumberInput value={g.marginLeft} onChange={v => update({ marginLeft: v })} min={0} max={200} />
        </Field>
      </div>

      <div className="subsection-title" style={{ marginTop: 16 }}>Typography</div>
      <Field label="Font family">
        <Select<FontFamily> value={g.fontFamily} onChange={v => update({ fontFamily: v })} options={FONTS} />
      </Field>
      <div className="two-col">
        <Field label="Base size (pt)">
          <NumberInput value={g.baseFontSize} onChange={v => update({ baseFontSize: v })} min={6} max={16} step={0.5} />
        </Field>
        <Field label="Line height">
          <NumberInput value={g.lineHeight} onChange={v => update({ lineHeight: v })} min={1} max={3} step={0.1} />
        </Field>
      </div>
      <Field label="Section spacing (pt)">
        <NumberInput value={g.sectionSpacing} onChange={v => update({ sectionSpacing: v })} min={0} max={40} />
      </Field>

      <div className="subsection-title" style={{ marginTop: 16 }}>Colors</div>
      <Field label="Primary color">
        <ColorInput value={g.primaryColor} onChange={v => update({ primaryColor: v })} />
      </Field>
      <Field label="Secondary color">
        <ColorInput value={g.secondaryColor} onChange={v => update({ secondaryColor: v })} />
      </Field>
      <Field label="Body text color">
        <ColorInput value={g.textColor} onChange={v => update({ textColor: v })} />
      </Field>
      <Field label="Background color">
        <ColorInput value={g.bgColor} onChange={v => update({ bgColor: v })} />
      </Field>
    </div>
  );
}
