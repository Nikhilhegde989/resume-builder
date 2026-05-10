import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  ResumeData,
  Section,
  SectionType,
  GlobalStyles,
  SectionStyles,
  SectionData,
  ExperienceData,
  EducationData,
  SkillsData,
  ProjectsData,
  CustomData,
} from './types';
import { createDefaultResume, DEFAULT_SECTION_STYLES } from './defaultData';

let _idCounter = 0;
const uid = () => `${Date.now()}-${++_idCounter}`;

const defaultSectionData: Record<SectionType, () => SectionData> = {
  header: () => ({
    name: 'Your Name', title: '', email: '', phone: '',
    location: '', linkedin: '', website: '',
    nameSize: 26, nameColor: '#1a1a2e', titleSize: 13, titleColor: '#2563eb',
    contactSize: 9, contactColor: '#374151', alignment: 'center', separator: '  ·  ',
  }),
  summary: () => ({ text: '' }),
  experience: () => ({ items: [] }),
  education: () => ({ items: [] }),
  skills: () => ({ layout: 'categories', categories: [] }),
  projects: () => ({ items: [] }),
  custom: () => ({ items: [] }),
};

const sectionTitles: Record<SectionType, string> = {
  header: 'Header',
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  custom: 'Custom Section',
};

interface ResumeStore {
  resume: ResumeData;
  selectedSectionId: string | null;

  // Global
  updateGlobalStyles: (updates: Partial<GlobalStyles>) => void;

  // Sections
  addSection: (type: SectionType) => void;
  removeSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  updateSectionTitle: (id: string, title: string) => void;
  updateSectionStyles: (id: string, updates: Partial<SectionStyles>) => void;
  updateSectionData: (id: string, updates: Partial<SectionData>) => void;
  toggleVisibility: (id: string) => void;
  reorderSections: (newOrder: Section[]) => void;

  // Sub-item helpers for list-based sections
  addExperienceItem: (sectionId: string) => void;
  removeExperienceItem: (sectionId: string, itemId: string) => void;
  updateExperienceItem: (sectionId: string, itemId: string, updates: Partial<ExperienceData['items'][0]>) => void;

  addEducationItem: (sectionId: string) => void;
  removeEducationItem: (sectionId: string, itemId: string) => void;
  updateEducationItem: (sectionId: string, itemId: string, updates: Partial<EducationData['items'][0]>) => void;

  addSkillCategory: (sectionId: string) => void;
  removeSkillCategory: (sectionId: string, catId: string) => void;
  updateSkillCategory: (sectionId: string, catId: string, updates: Partial<SkillsData['categories'][0]>) => void;

  addProjectItem: (sectionId: string) => void;
  removeProjectItem: (sectionId: string, itemId: string) => void;
  updateProjectItem: (sectionId: string, itemId: string, updates: Partial<ProjectsData['items'][0]>) => void;

  addCustomItem: (sectionId: string) => void;
  removeCustomItem: (sectionId: string, itemId: string) => void;
  updateCustomItem: (sectionId: string, itemId: string, updates: Partial<CustomData['items'][0]>) => void;

  // UI
  selectSection: (id: string | null) => void;

  // Persistence
  importResume: (data: ResumeData) => void;
  resetToDefault: () => void;
}

const updateSection = (
  sections: Section[],
  id: string,
  updater: (s: Section) => Section
): Section[] => sections.map(s => (s.id === id ? updater(s) : s));

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resume: createDefaultResume(),
      selectedSectionId: null,

      updateGlobalStyles: (updates) =>
        set(state => ({
          resume: { ...state.resume, globalStyles: { ...state.resume.globalStyles, ...updates } },
        })),

      addSection: (type) => {
        const newSection: Section = {
          id: uid(),
          type,
          title: sectionTitles[type],
          visible: true,
          styles: { ...DEFAULT_SECTION_STYLES },
          data: defaultSectionData[type](),
        };
        set(state => ({
          resume: { ...state.resume, sections: [...state.resume.sections, newSection] },
          selectedSectionId: newSection.id,
        }));
      },

      removeSection: (id) =>
        set(state => ({
          resume: { ...state.resume, sections: state.resume.sections.filter(s => s.id !== id) },
          selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
        })),

      duplicateSection: (id) => {
        const section = get().resume.sections.find(s => s.id === id);
        if (!section) return;
        const copy: Section = { ...section, id: uid(), title: section.title + ' (copy)' };
        set(state => {
          const idx = state.resume.sections.findIndex(s => s.id === id);
          const sections = [...state.resume.sections];
          sections.splice(idx + 1, 0, copy);
          return { resume: { ...state.resume, sections }, selectedSectionId: copy.id };
        });
      },

      updateSectionTitle: (id, title) =>
        set(state => ({
          resume: { ...state.resume, sections: updateSection(state.resume.sections, id, s => ({ ...s, title })) },
        })),

      updateSectionStyles: (id, updates) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, id, s => ({
              ...s,
              styles: { ...s.styles, ...updates },
            })),
          },
        })),

      updateSectionData: (id, updates) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, id, s => ({
              ...s,
              data: { ...s.data, ...updates } as SectionData,
            })),
          },
        })),

      toggleVisibility: (id) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, id, s => ({ ...s, visible: !s.visible })),
          },
        })),

      reorderSections: (newOrder) =>
        set(state => ({ resume: { ...state.resume, sections: newOrder } })),

      // ─── Experience ──────────────────────────────────────────────────────

      addExperienceItem: (sectionId) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as ExperienceData),
                items: [
                  ...(s.data as ExperienceData).items,
                  { id: uid(), company: '', role: '', startDate: '', endDate: '', current: false, location: '', bullets: [] },
                ],
              },
            })),
          },
        })),

      removeExperienceItem: (sectionId, itemId) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as ExperienceData),
                items: (s.data as ExperienceData).items.filter(i => i.id !== itemId),
              },
            })),
          },
        })),

      updateExperienceItem: (sectionId, itemId, updates) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as ExperienceData),
                items: (s.data as ExperienceData).items.map(i =>
                  i.id === itemId ? { ...i, ...updates } : i
                ),
              },
            })),
          },
        })),

      // ─── Education ───────────────────────────────────────────────────────

      addEducationItem: (sectionId) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as EducationData),
                items: [
                  ...(s.data as EducationData).items,
                  { id: uid(), institution: '', degree: '', field: '', startDate: '', endDate: '', current: false, location: '', gpa: '', bullets: [] },
                ],
              },
            })),
          },
        })),

      removeEducationItem: (sectionId, itemId) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as EducationData),
                items: (s.data as EducationData).items.filter(i => i.id !== itemId),
              },
            })),
          },
        })),

      updateEducationItem: (sectionId, itemId, updates) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as EducationData),
                items: (s.data as EducationData).items.map(i =>
                  i.id === itemId ? { ...i, ...updates } : i
                ),
              },
            })),
          },
        })),

      // ─── Skills ──────────────────────────────────────────────────────────

      addSkillCategory: (sectionId) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as SkillsData),
                categories: [
                  ...(s.data as SkillsData).categories,
                  { id: uid(), category: '', skills: '' },
                ],
              },
            })),
          },
        })),

      removeSkillCategory: (sectionId, catId) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as SkillsData),
                categories: (s.data as SkillsData).categories.filter(c => c.id !== catId),
              },
            })),
          },
        })),

      updateSkillCategory: (sectionId, catId, updates) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as SkillsData),
                categories: (s.data as SkillsData).categories.map(c =>
                  c.id === catId ? { ...c, ...updates } : c
                ),
              },
            })),
          },
        })),

      // ─── Projects ────────────────────────────────────────────────────────

      addProjectItem: (sectionId) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as ProjectsData),
                items: [
                  ...(s.data as ProjectsData).items,
                  { id: uid(), name: '', description: '', tech: '', link: '', bullets: [] },
                ],
              },
            })),
          },
        })),

      removeProjectItem: (sectionId, itemId) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as ProjectsData),
                items: (s.data as ProjectsData).items.filter(i => i.id !== itemId),
              },
            })),
          },
        })),

      updateProjectItem: (sectionId, itemId, updates) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as ProjectsData),
                items: (s.data as ProjectsData).items.map(i =>
                  i.id === itemId ? { ...i, ...updates } : i
                ),
              },
            })),
          },
        })),

      // ─── Custom ──────────────────────────────────────────────────────────

      addCustomItem: (sectionId) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as CustomData),
                items: [
                  ...(s.data as CustomData).items,
                  { id: uid(), title: '', subtitle: '', date: '', content: '' },
                ],
              },
            })),
          },
        })),

      removeCustomItem: (sectionId, itemId) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as CustomData),
                items: (s.data as CustomData).items.filter(i => i.id !== itemId),
              },
            })),
          },
        })),

      updateCustomItem: (sectionId, itemId, updates) =>
        set(state => ({
          resume: {
            ...state.resume,
            sections: updateSection(state.resume.sections, sectionId, s => ({
              ...s,
              data: {
                ...(s.data as CustomData),
                items: (s.data as CustomData).items.map(i =>
                  i.id === itemId ? { ...i, ...updates } : i
                ),
              },
            })),
          },
        })),

      // ─── UI ──────────────────────────────────────────────────────────────

      selectSection: (id) => set({ selectedSectionId: id }),

      importResume: (data) => set({ resume: data, selectedSectionId: null }),

      resetToDefault: () => set({ resume: createDefaultResume(), selectedSectionId: null }),
    }),
    {
      name: 'resume-builder-v1',
    }
  )
);
