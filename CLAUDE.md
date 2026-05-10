# Resume Builder — Project Reference

Personal resume builder: edit content, see a live PDF preview, export a pixel-perfect PDF.
Built for Nikhil's own use. No backend, no database.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
```

State is auto-saved to `localStorage` (key: `resume-builder-v1`).
Use **Export JSON** in the toolbar to back up to a file; **Import JSON** to restore.

---

## Tech stack

| Library | Role |
|---------|------|
| Vite + React 18 + TypeScript | Build tool and UI framework |
| `@react-pdf/renderer` v4 | PDF generation AND live preview — same renderer, two outputs |
| Zustand v5 + `persist` middleware | Global state + automatic localStorage sync |
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag-and-drop section reordering |

---

## Architecture

### The core idea

One React component — `src/pdf/ResumeDocument.tsx` — is used for both the live preview
and the PDF export. Preview calls `<PDFViewer>`, export calls `pdf().toBlob()`.
Because the same renderer runs both, what you see is exactly what you get.

```
<ResumeDocument resume={data} />
    ├── inside <PDFViewer>     → renders into an iframe (live preview)
    └── passed to pdf(...)     → generates a Blob → download as resume.pdf
```

`@react-pdf/renderer` is NOT html2canvas. It runs the **Yoga flexbox engine** (same as
React Native, compiled to WASM) to compute layout, then emits real PDF drawing commands.
Output is a proper vector PDF — text is selectable, fonts are embedded, ATS-readable.

### Data flow

```
User edits a field
  → Zustand action (immutable update)
  → persist middleware serializes to localStorage
  → Zustand selector re-evaluates; only changed components re-render
  → Editor updates immediately
  → useDebounce(resume, 400ms) fires
  → ResumeDocument re-renders inside PDFViewer
  → @react-pdf runs Yoga layout → new PDF bytes → iframe refreshes
```

### State shape (`src/types.ts`)

```typescript
ResumeData
  ├── version: 1
  ├── globalStyles: GlobalStyles        // font, page size, margins, colors
  └── sections: Section[]
        ├── id, type, title, visible
        ├── styles: SectionStyles       // per-section title/divider/content styling
        └── data: SectionData           // union type — shape depends on `type`
```

`SectionData` is a **discriminated union**: `HeaderData | SummaryData | ExperienceData | ...`.
The `section.type` field is the discriminant. Every component that handles a specific section
casts `section.data` as the concrete type (e.g., `section.data as ExperienceData`).

---

## File structure

```
src/
├── types.ts              All TypeScript types (start here to understand the data model)
├── defaultData.ts        createDefaultResume() — the initial sample resume
├── store.ts              Zustand store: all state + every action
│
├── pdf/                  PDF document components (react-pdf primitives: View, Text, Page)
│   ├── ResumeDocument.tsx   Top-level Document/Page + section dispatcher
│   ├── PdfHeader.tsx
│   ├── PdfSummary.tsx
│   ├── PdfExperience.tsx
│   ├── PdfEducation.tsx
│   ├── PdfSkills.tsx
│   ├── PdfProjects.tsx
│   └── PdfCustom.tsx
│
├── editor/               Left-panel editor UI (standard React DOM components)
│   ├── EditorPanel.tsx      Tab container (Sections | Design)
│   ├── FormControls.tsx     Shared form primitives: Field, TextInput, ColorInput, etc.
│   ├── GlobalStylesEditor.tsx  Design tab — page, typography, colors
│   ├── SectionsList.tsx     Sortable list of sections with dnd-kit
│   ├── SectionEditor.tsx    Content + Styles tabs for a single section
│   ├── SectionStylesEditor.tsx  Per-section title/divider/content style controls
│   └── content/
│       ├── HeaderEditor.tsx
│       ├── SummaryEditor.tsx
│       ├── ExperienceEditor.tsx
│       ├── EducationEditor.tsx
│       ├── SkillsEditor.tsx
│       ├── ProjectsEditor.tsx
│       └── CustomEditor.tsx
│
├── preview/
│   └── PreviewPanel.tsx   Debounced PDFViewer wrapper
│
├── App.tsx               Toolbar (export PDF, export/import JSON, reset) + layout
├── App.css               All editor UI styles — CSS variables at top of :root block
└── main.tsx              React entry point
```

---

## How to extend

### Add a new section type

1. **`src/types.ts`** — add the type name to `SectionType` union; define a new `*Data` interface;
   add it to the `SectionData` union.

2. **`src/defaultData.ts`** — add an entry to `defaultSectionData` record and optionally
   add a default section in `createDefaultResume()`.

3. **`src/pdf/Pdf*.tsx`** — create a new component that accepts `data`, `styles`, `global`
   and uses react-pdf `View`/`Text` primitives.

4. **`src/pdf/ResumeDocument.tsx`** — import the new component; add it to the
   `SectionWrapper` dispatcher (`{section.type === 'newtype' && <PdfNewType ... />}`).

5. **`src/editor/content/*Editor.tsx`** — create an editor that reads/writes the section's
   data via `useResumeStore(s => s.updateSectionData)`.

6. **`src/editor/SectionEditor.tsx`** — add the new editor to `CONTENT_EDITORS` map.

7. **`src/editor/SectionsList.tsx`** — add the type to `ADD_SECTION_TYPES` array and
   `SECTION_ICONS` map so it appears in the "Add Section" menu.

8. **`src/store.ts`** — if the section has list-based items (like experience), add
   `add*/remove*/update*` actions following the existing pattern.

### Add a custom font

Register in `src/pdf/ResumeDocument.tsx` before the component definitions:

```typescript
import { Font } from '@react-pdf/renderer';

Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v13/...Regular.ttf' },
    { src: 'https://fonts.gstatic.com/s/inter/v13/...Bold.ttf', fontWeight: 700 },
    { src: 'https://fonts.gstatic.com/s/inter/v13/...Italic.ttf', fontStyle: 'italic' },
  ],
});
```

Then add `'Inter'` to the `FontFamily` type in `src/types.ts` and the `FONTS` options
array in `src/editor/GlobalStylesEditor.tsx`.

Note: react-pdf needs TTF/OTF/WOFF/WOFF2 URLs — not Google Fonts CSS URLs.

### Change the editor panel width

Edit the `--editor-width` CSS variable at the top of `src/App.css`:

```css
:root {
  --editor-width: 440px;  /* change this */
}
```

### Change the preview background color

```css
.preview-panel {
  background: #525659;  /* the gray around the PDF page */
}
```

---

## Key patterns used throughout

### Immutable Zustand updates

All state is updated immutably — spread at every level, never mutate in place.
This is required because Zustand (and React) use reference equality to detect changes.

```typescript
// Pattern for deep nested updates:
set(state => ({
  resume: {
    ...state.resume,
    sections: state.resume.sections.map(s =>
      s.id === targetId
        ? { ...s, data: { ...s.data, ...updates } as SectionData }
        : s
    ),
  },
}));
```

### Zustand selectors — subscribe to slices, not the whole store

```typescript
// ✓ Component only re-renders when this specific section changes
const section = useResumeStore(s =>
  s.resume.sections.find(sec => sec.id === sectionId)
);

// ✗ Avoid — re-renders on ANY state change
const store = useResumeStore();
```

### Debounced preview

`useDebounce(resume, 400)` in `PreviewPanel.tsx` delays the PDF re-render 400ms after
the last change. The editor always shows the latest value; the preview catches up after
the user pauses.

### dnd-kit drag handle pattern

`listeners` (the drag event handlers) are applied only to the drag handle element,
not the whole section row. This lets clicks on buttons inside the row work normally.

```tsx
const { listeners, attributes, setNodeRef, transform } = useSortable({ id });

// Only the handle gets drag events
<button {...listeners} {...attributes}>⠿</button>

// Everything else ignores drag
<span onClick={doSomething}>Section title</span>
```

---

## react-pdf style notes

react-pdf uses a subset of CSS Flexbox (via the Yoga engine). Differences from HTML CSS:

- Default `flexDirection` is `'column'` (same as React Native, opposite of browser default)
- Units are **points** (pt), not px. 1pt = 1/72 inch. Standard margins: 36pt = 0.5in.
- `fontWeight: 'bold'` works for the built-in fonts (Helvetica, Times-Roman, Courier).
  For custom fonts you must register a separate bold TTF and set `fontWeight: 700`.
- `textTransform: 'uppercase'` is supported.
- No `border` shorthand — use `borderBottomWidth`, `borderBottomColor`, etc.
- `gap` is supported in v4+.
- `Link` component takes a `src` prop (not `href`).
