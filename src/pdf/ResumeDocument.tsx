import { Document, Page, View, Text, Font } from '@react-pdf/renderer';

Font.register({
  family: 'Barlow',
  fonts: [
    { src: '/fonts/Barlow-Regular.ttf' },
    { src: '/fonts/Barlow-Bold.ttf', fontWeight: 700 },
    { src: '/fonts/Barlow-Italic.ttf', fontStyle: 'italic' },
    { src: '/fonts/Barlow-BoldItalic.ttf', fontWeight: 700, fontStyle: 'italic' },
  ],
});
import type { ResumeData, Section } from '../types';
import { PdfHeader } from './PdfHeader';
import { PdfSummary } from './PdfSummary';
import { PdfExperience } from './PdfExperience';
import { PdfEducation } from './PdfEducation';
import { PdfSkills } from './PdfSkills';
import { PdfProjects } from './PdfProjects';
import { PdfCustom } from './PdfCustom';
import type {
  HeaderData, SummaryData, ExperienceData,
  EducationData, SkillsData, ProjectsData, CustomData,
} from '../types';

interface Props {
  resume: ResumeData;
}

function SectionWrapper({ section, resume }: { section: Section; resume: ResumeData }) {
  const { styles, global } = { styles: section.styles, global: resume.globalStyles };
  const font = global.fontFamily;

  return (
    <View style={{ marginBottom: global.sectionSpacing }}>
      {/* Section title (skipped for header since it has its own layout) */}
      {section.type !== 'header' && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
          <Text
            style={{
              fontSize: styles.titleFontSize,
              color: styles.titleColor,
              fontFamily: font,
              fontWeight: styles.titleBold ? 'bold' : 'normal',
              fontStyle: styles.titleItalic ? 'italic' : 'normal',
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {section.title}
          </Text>
          {styles.showDivider && (
            <View
              style={{
                flex: 1,
                borderBottomWidth: styles.dividerThickness,
                borderBottomColor: styles.dividerColor,
                marginLeft: 6,
              }}
            />
          )}
        </View>
      )}

      {/* Section content */}
      {section.type === 'header' && (
        <PdfHeader data={section.data as HeaderData} global={global} />
      )}
      {section.type === 'summary' && (
        <PdfSummary data={section.data as SummaryData} styles={styles} global={global} />
      )}
      {section.type === 'experience' && (
        <PdfExperience data={section.data as ExperienceData} styles={styles} global={global} />
      )}
      {section.type === 'education' && (
        <PdfEducation data={section.data as EducationData} styles={styles} global={global} />
      )}
      {section.type === 'skills' && (
        <PdfSkills data={section.data as SkillsData} styles={styles} global={global} />
      )}
      {section.type === 'projects' && (
        <PdfProjects data={section.data as ProjectsData} styles={styles} global={global} />
      )}
      {section.type === 'custom' && (
        <PdfCustom data={section.data as CustomData} styles={styles} global={global} />
      )}
    </View>
  );
}

export function ResumeDocument({ resume }: Props) {
  const { globalStyles: g } = resume;
  const visibleSections = resume.sections.filter(s => s.visible);
  const headerSection = resume.sections.find(s => s.type === 'header');
  const authorName = headerSection ? (headerSection.data as HeaderData).name : 'Resume';

  return (
    <Document
      title={authorName}
      author={authorName}
      subject="Resume"
      creator="Resume Builder"
      producer="Resume Builder"
    >
      <Page
        size={g.pageSize}
        style={{
          fontFamily: g.fontFamily,
          fontSize: g.baseFontSize,
          backgroundColor: g.bgColor,
          paddingTop: g.marginTop,
          paddingRight: g.marginRight,
          paddingBottom: g.marginBottom,
          paddingLeft: g.marginLeft,
          color: g.textColor,
        }}
      >
        {g.showPageBorder && (
          <View
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              borderWidth: 1,
              borderColor: g.pageBorderColor ?? '#d1d5db',
              borderStyle: 'solid',
            }}
          />
        )}
        {visibleSections.map(section => (
          <SectionWrapper key={section.id} section={section} resume={resume} />
        ))}
      </Page>
    </Document>
  );
}
