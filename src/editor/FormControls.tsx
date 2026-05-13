import { useRef } from 'react';
import type { ReactNode, ChangeEvent } from 'react';

// ─── Reusable form primitives ─────────────────────────────────────────────

interface FieldProps {
  label: string;
  children: ReactNode;
  row?: boolean;
}

export function Field({ label, children, row }: FieldProps) {
  return (
    <div className={`field ${row ? 'field-row' : ''}`}>
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
}

export function TextInput({ value, onChange, placeholder, multiline, rows = 3 }: TextInputProps) {
  if (multiline) {
    return (
      <textarea
        className="form-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
      />
    );
  }
  return (
    <input
      type="text"
      className="form-input"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export function NumberInput({ value, onChange, min, max, step = 1 }: NumberInputProps) {
  return (
    <input
      type="number"
      className="form-input form-input-number"
      value={value}
      onChange={e => onChange(Number(e.target.value))}
      min={min}
      max={max}
      step={step}
    />
  );
}

interface ColorInputProps {
  value: string;
  onChange: (v: string) => void;
}

export function ColorInput({ value, onChange }: ColorInputProps) {
  return (
    <div className="color-input-row">
      <input
        type="color"
        className="color-swatch"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      <input
        type="text"
        className="form-input color-hex"
        value={value}
        onChange={e => {
          const v = e.target.value;
          if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
        }}
        maxLength={7}
      />
    </div>
  );
}

interface SelectProps<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}

export function Select<T extends string>({ value, onChange, options }: SelectProps<T>) {
  return (
    <select
      className="form-input"
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as T)}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="checkbox-label">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

interface ToggleBtnProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  title?: string;
}

export function ToggleBtn({ active, onClick, children, title }: ToggleBtnProps) {
  return (
    <button
      className={`toggle-btn ${active ? 'toggle-btn-active' : ''}`}
      onClick={onClick}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

// Bullet list editor (shared by experience, education, projects)
interface BulletEditorProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
  placeholder?: string;
}

export function BulletEditor({ bullets, onChange, placeholder = 'Add a bullet point...' }: BulletEditorProps) {
  const refs = useRef<(HTMLTextAreaElement | null)[]>([]);

  const update = (i: number, v: string) => {
    const next = [...bullets];
    next[i] = v;
    onChange(next);
  };
  const remove = (i: number) => onChange(bullets.filter((_, idx) => idx !== i));
  const add = () => onChange([...bullets, '']);

  const applyBold = (i: number) => {
    const ta = refs.current[i];
    if (!ta) return;
    const { selectionStart, selectionEnd, value } = ta;
    if (selectionStart === selectionEnd) return;
    const newValue =
      value.slice(0, selectionStart) +
      `**${value.slice(selectionStart, selectionEnd)}**` +
      value.slice(selectionEnd);
    update(i, newValue);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = selectionStart + 2;
      ta.selectionEnd = selectionEnd + 2;
    }, 0);
  };

  const applyLink = (i: number) => {
    const ta = refs.current[i];
    if (!ta) return;
    const { selectionStart, selectionEnd, value } = ta;
    if (selectionStart === selectionEnd) return;
    const url = window.prompt('Enter URL:');
    if (!url) return;
    const selected = value.slice(selectionStart, selectionEnd);
    const newValue = value.slice(0, selectionStart) + `[${selected}](${url})` + value.slice(selectionEnd);
    update(i, newValue);
    setTimeout(() => ta.focus(), 0);
  };

  return (
    <div className="bullet-editor">
      {bullets.map((b, i) => (
        <div key={i} className="bullet-row">
          <span className="bullet-dot">•</span>
          <textarea
            ref={el => { refs.current[i] = el; }}
            className="form-input bullet-input"
            value={b}
            rows={Math.max(1, (b.match(/\n/g) ?? []).length + 1)}
            onChange={e => update(i, e.target.value)}
            placeholder={placeholder}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                add();
              } else if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
                e.preventDefault();
                applyBold(i);
              } else if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                applyLink(i);
              }
            }}
          />
          <div className="bullet-actions">
            <button
              type="button"
              className="icon-btn bold-btn"
              onMouseDown={e => e.preventDefault()}
              onClick={() => applyBold(i)}
              title="Bold selected text (Ctrl+B)"
            >
              B
            </button>
            <button
              type="button"
              className="icon-btn link-btn"
              onMouseDown={e => e.preventDefault()}
              onClick={() => applyLink(i)}
              title="Add hyperlink to selected text (Ctrl+K)"
            >
              ↗
            </button>
            <button type="button" className="icon-btn danger" onClick={() => remove(i)} title="Remove">×</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn-add-small" onClick={add}>+ Add bullet</button>
    </div>
  );
}
