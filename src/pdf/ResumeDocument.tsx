import { Document, Page, View, Text } from '@react-pdf/renderer';
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
        <View>
          <Text
            style={{
              fontSize: styles.titleFontSize,
              color: styles.titleColor,
              fontFamily: font,
              fontWeight: styles.titleBold ? 'bold' : 'normal',
              fontStyle: styles.titleItalic ? 'italic' : 'normal',
              textAlign: styles.titleAlignment,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {section.title}
          </Text>
          {styles.showDivider && (
            <View
              style={{
                borderBottomWidth: styles.dividerThickness,
                borderBottomColor: styles.dividerColor,
                marginTop: 2,
                marginBottom: 5,
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

  return (
    <Document>
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
        {visibleSections.map(section => (
          <SectionWrapper key={section.id} section={section} resume={resume} />
        ))}
      </Page>
    </Document>
  );
}
