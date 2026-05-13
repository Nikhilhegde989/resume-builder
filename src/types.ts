export type FontFamily = 'Helvetica' | 'Times-Roman' | 'Courier' | 'Barlow';
export type PageSize = 'A4' | 'LETTER';
export type Alignment = 'left' | 'center' | 'right';
export type SectionType = 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'custom';

export interface GlobalStyles {
  fontFamily: FontFamily;
  baseFontSize: number;      // pt
  primaryColor: string;      // section titles, borders
  secondaryColor: string;    // company names, school names
  textColor: string;         // body text
  bgColor: string;
  pageSize: PageSize;
  marginTop: number;         // pt
  marginRight: number;
  marginBottom: number;
  marginLeft: number;
  sectionSpacing: number;    // pt between sections
  lineHeight: number;        // multiplier
  showPageBorder?: boolean;
  pageBorderColor?: string;
  dateFontSize: number;
  dateBold: boolean;
  locationFontSize: number;
  locationBold: boolean;
}

export interface SectionStyles {
  titleFontSize: number;
  titleColor: string;
  titleBold: boolean;
  titleItalic: boolean;
  titleAlignment: Alignment;
  showDivider: boolean;
  dividerColor: string;
  dividerThickness: number;
  itemSpacing: number;
  contentFontSize: number;
  contentColor: string;
}

// ─── Section data types ────────────────────────────────────────────────────

export interface HeaderData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  linkedinLabel: string;
  website: string;
  websiteLabel: string;
  nameSize: number;
  nameColor: string;
  titleSize: number;
  titleColor: string;
  contactSize: number;
  contactColor: string;
  alignment: Alignment;
  separator: string;        // e.g. " | " between contact items
}

export interface SummaryData {
  text: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  technologies: string;
  bullets: string[];
  pageBreakBefore?: boolean;
}

export interface ExperienceData {
  roleFontSize?: number;
  items: ExperienceItem[];
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  gpa: string;
  bullets: string[];
}

export interface EducationData {
  items: EducationItem[];
}

export interface SkillCategory {
  id: string;
  category: string;
  skills: string;   // comma-separated list
}

export interface SkillsData {
  layout: 'list' | 'categories';
  categories: SkillCategory[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tech: string;       // comma-separated
  link: string;
  bullets: string[];
}

export interface ProjectsData {
  items: ProjectItem[];
}

export interface CustomItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  content: string;
  link: string;
  bullets: string[];
}

export interface CustomData {
  showItemBullet?: boolean;
  items: CustomItem[];
}

export type SectionData =
  | HeaderData
  | SummaryData
  | ExperienceData
  | EducationData
  | SkillsData
  | ProjectsData
  | CustomData;

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  styles: SectionStyles;
  data: SectionData;
}

export interface ResumeData {
  version: 1;
  globalStyles: GlobalStyles;
  sections: Section[];
}
