import type { ResumeData, GlobalStyles, SectionStyles, Section } from './types';

let _idCounter = 0;
const uid = () => `${Date.now()}-${++_idCounter}`;

const defaultGlobal: GlobalStyles = {
  fontFamily: 'Helvetica',
  baseFontSize: 10,
  primaryColor: '#1a1a2e',
  secondaryColor: '#2563eb',
  textColor: '#374151',
  bgColor: '#ffffff',
  pageSize: 'LETTER',
  marginTop: 36,
  marginRight: 40,
  marginBottom: 36,
  marginLeft: 40,
  sectionSpacing: 10,
  lineHeight: 1.4,
};

const defaultSectionStyles: SectionStyles = {
  titleFontSize: 12,
  titleColor: '#1a1a2e',
  titleBold: true,
  titleItalic: false,
  titleAlignment: 'left',
  showDivider: true,
  dividerColor: '#1a1a2e',
  dividerThickness: 1,
  itemSpacing: 6,
  contentFontSize: 10,
  contentColor: '#374151',
};

export function createDefaultResume(): ResumeData {
  const sections: Section[] = [
    {
      id: uid(),
      type: 'header',
      title: 'Header',
      visible: true,
      styles: { ...defaultSectionStyles, showDivider: false, titleAlignment: 'center' },
      data: {
        name: 'Your Name',
        title: 'Software Engineer',
        email: 'your.email@example.com',
        phone: '+1 (555) 000-0000',
        location: 'City, State',
        linkedin: 'linkedin.com/in/yourprofile',
        website: 'github.com/yourhandle',
        nameSize: 26,
        nameColor: '#1a1a2e',
        titleSize: 13,
        titleColor: '#2563eb',
        contactSize: 9,
        contactColor: '#374151',
        alignment: 'center',
        separator: '  ·  ',
      },
    },
    {
      id: uid(),
      type: 'summary',
      title: 'Summary',
      visible: true,
      styles: { ...defaultSectionStyles },
      data: {
        text: 'Experienced software engineer with a passion for building scalable and maintainable systems. Proven track record of delivering high-quality products and collaborating effectively with cross-functional teams.',
      },
    },
    {
      id: uid(),
      type: 'experience',
      title: 'Experience',
      visible: true,
      styles: { ...defaultSectionStyles },
      data: {
        items: [
          {
            id: uid(),
            company: 'Acme Corp',
            role: 'Senior Software Engineer',
            startDate: 'Jan 2022',
            endDate: '',
            current: true,
            location: 'San Francisco, CA',
            bullets: [
              'Led the migration of a monolithic application to microservices, improving deployment frequency by 3x.',
              'Mentored a team of 4 junior engineers and conducted regular code reviews.',
              'Reduced API latency by 40% through caching strategies and query optimization.',
            ],
          },
          {
            id: uid(),
            company: 'Startup Inc',
            role: 'Software Engineer',
            startDate: 'Jun 2019',
            endDate: 'Dec 2021',
            current: false,
            location: 'New York, NY',
            bullets: [
              'Built and shipped features for a B2B SaaS platform serving 10,000+ users.',
              'Designed and implemented a real-time notification system using WebSockets.',
            ],
          },
        ],
      },
    },
    {
      id: uid(),
      type: 'education',
      title: 'Education',
      visible: true,
      styles: { ...defaultSectionStyles },
      data: {
        items: [
          {
            id: uid(),
            institution: 'State University',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: 'Sep 2015',
            endDate: 'May 2019',
            current: false,
            location: 'College Town, ST',
            gpa: '3.8',
            bullets: [],
          },
        ],
      },
    },
    {
      id: uid(),
      type: 'skills',
      title: 'Skills',
      visible: true,
      styles: { ...defaultSectionStyles },
      data: {
        layout: 'categories',
        categories: [
          { id: uid(), category: 'Languages', skills: 'TypeScript, Python, Go, SQL' },
          { id: uid(), category: 'Frameworks', skills: 'React, Node.js, FastAPI, gRPC' },
          { id: uid(), category: 'Tools', skills: 'Docker, Kubernetes, PostgreSQL, Redis, AWS' },
        ],
      },
    },
    {
      id: uid(),
      type: 'projects',
      title: 'Projects',
      visible: false,
      styles: { ...defaultSectionStyles },
      data: {
        items: [
          {
            id: uid(),
            name: 'OpenSource Project',
            description: 'A tool that does something useful.',
            tech: 'TypeScript, React, Node.js',
            link: 'github.com/you/project',
            bullets: [
              'Implemented feature X that solved problem Y.',
              'Achieved Z stars on GitHub.',
            ],
          },
        ],
      },
    },
    {
      id: uid(),
      type: 'custom',
      title: 'Certifications',
      visible: false,
      styles: { ...defaultSectionStyles },
      data: {
        items: [
          {
            id: uid(),
            title: 'AWS Certified Solutions Architect',
            subtitle: 'Amazon Web Services',
            date: '2023',
            content: '',
          },
        ],
      },
    },
  ];

  return {
    version: 1,
    globalStyles: defaultGlobal,
    sections,
  };
}

export const DEFAULT_SECTION_STYLES: SectionStyles = defaultSectionStyles;
