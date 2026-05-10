import { useResumeStore } from '../store';
import { Field, NumberInput, ColorInput, Select, Checkbox, ToggleBtn } from './FormControls';
import type { Alignment } from '../types';

const ALIGNMENTS: { value: Alignment; label: string }[] = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
];

interface Props {
  sectionId: string;
}

export function SectionStylesEditor({ sectionId }: Props) {
  const styles = useResumeStore(s => s.resume.sections.find(sec => sec.id === sectionId)!.styles);
  const update = useResumeStore(s => s.updateSectionStyles);
  const upd = (p: Parameters<typeof update>[1]) => update(sectionId, p);

  return (
    <div className="section-block">
      <div className="subsection-title">Title</div>
      <div className="two-col">
        <Field label="Font size (pt)">
          <NumberInput value={styles.titleFontSize} onChange={v => upd({ titleFontSize: v })} min={6} max={30} />
        </Field>
        <Field label="Color">
          <ColorInput value={styles.titleColor} onChange={v => upd({ titleColor: v })} />
        </Field>
      </div>
      <Field label="Alignment">
        <Select<Alignment> value={styles.titleAlignment} onChange={v => upd({ titleAlignment: v })} options={ALIGNMENTS} />
      </Field>
      <div className="btn-group">
        <ToggleBtn active={styles.titleBold} onClick={() => upd({ titleBold: !styles.titleBold })} title="Bold">
          <strong>B</strong>
        </ToggleBtn>
        <ToggleBtn active={styles.titleItalic} onClick={() => upd({ titleItalic: !styles.titleItalic })} title="Italic">
          <em>I</em>
        </ToggleBtn>
      </div>

      <div className="subsection-title" style={{ marginTop: 14 }}>Divider</div>
      <Checkbox label="Show divider line" checked={styles.showDivider} onChange={v => upd({ showDivider: v })} />
      {styles.showDivider && (
        <>
          <div className="two-col" style={{ marginTop: 8 }}>
            <Field label="Color">
              <ColorInput value={styles.dividerColor} onChange={v => upd({ dividerColor: v })} />
            </Field>
            <Field label="Thickness (pt)">
              <NumberInput value={styles.dividerThickness} onChange={v => upd({ dividerThickness: v })} min={0.5} max={4} step={0.5} />
            </Field>
          </div>
        </>
      )}

      <div className="subsection-title" style={{ marginTop: 14 }}>Content</div>
      <div className="two-col">
        <Field label="Font size (pt)">
          <NumberInput value={styles.contentFontSize} onChange={v => upd({ contentFontSize: v })} min={6} max={16} step={0.5} />
        </Field>
        <Field label="Color">
          <ColorInput value={styles.contentColor} onChange={v => upd({ contentColor: v })} />
        </Field>
      </div>
      <Field label="Item spacing (pt)">
        <NumberInput value={styles.itemSpacing} onChange={v => upd({ itemSpacing: v })} min={0} max={30} />
      </Field>
    </div>
  );
}
