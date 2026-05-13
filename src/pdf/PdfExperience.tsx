import { View, Text } from '@react-pdf/renderer';
import type { ExperienceData, SectionStyles, GlobalStyles } from '../types';
import { renderRichText } from './richText';

interface Props {
  data: ExperienceData;
  styles: SectionStyles;
  global: GlobalStyles;
}

export function PdfExperience({ data, styles, global }: Props) {
  const fs = styles.contentFontSize;
  const roleFs = data.roleFontSize ?? fs;
  const color = styles.contentColor;
  const font = global.fontFamily;

  return (
    <View>
      {data.items.map((item, idx) => (
        <View
          key={item.id}
          break={!!item.pageBreakBefore}
          style={{ marginBottom: idx < data.items.length - 1 ? styles.itemSpacing : 0 }}
        >
          {/* Header row: role | company | date + location */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            <Text style={{ fontSize: roleFs, fontFamily: font, fontWeight: 'bold', color, flex: 1 }}>
              {item.role}
            </Text>
            <Text style={{ fontSize: fs, fontFamily: font, color: global.secondaryColor, fontStyle: 'italic', flex: 1, textAlign: 'center' }}>
              {item.company}
            </Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={{ fontSize: global.dateFontSize ?? 9, fontFamily: font, color, fontWeight: global.dateBold ? 'bold' : 'normal' }}>
                {item.startDate}{item.startDate && (item.current || item.endDate) ? ' – ' : ''}
                {item.current ? 'Present' : item.endDate}
              </Text>
              {item.location ? (
                <Text style={{ fontSize: global.locationFontSize ?? 9, fontFamily: font, color, fontWeight: global.locationBold ? 'bold' : 'normal', marginTop: 1 }}>
                  {item.location}
                </Text>
              ) : null}
            </View>
          </View>

          {/* Technologies — full width */}
          {item.technologies ? (
            <Text style={{ fontSize: fs, fontFamily: font, color, marginTop: 2 }}>
              <Text style={{ fontWeight: 'bold' }}>Technologies: </Text>
              {item.technologies}
            </Text>
          ) : null}

          {/* Bullets — full width */}
          {item.bullets.filter(Boolean).map((bullet, i) => (
            <View key={i} style={{ marginTop: 2, paddingLeft: 10 }}>
              {renderRichText('• ' + bullet, { fontSize: fs, fontFamily: font, color, lineHeight: global.lineHeight })}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
