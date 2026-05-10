import { useResumeStore } from '../../store';
import { Field, TextInput } from '../FormControls';
import type { SummaryData } from '../../types';

interface Props { sectionId: string }

export function SummaryEditor({ sectionId }: Props) {
  const data = useResumeStore(s =>
    s.resume.sections.find(sec => sec.id === sectionId)!.data as SummaryData
  );
  const update = useResumeStore(s => s.updateSectionData);

  return (
    <Field label="Summary text">
      <TextInput
        value={data.text}
        onChange={v => update(sectionId, { text: v })}
        multiline
        rows={5}
        placeholder="Write a short professional summary..."
      />
    </Field>
  );
}
