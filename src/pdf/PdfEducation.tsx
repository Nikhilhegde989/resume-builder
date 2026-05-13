import { View, Text } from '@react-pdf/renderer';
import type { EducationData, SectionStyles, GlobalStyles } from '../types';

interface Props {
  data: EducationData;
  styles: SectionStyles;
  global: GlobalStyles;
}

export function PdfEducation({ data, styles, global }: Props) {
  const fs = styles.contentFontSize;
  const color = styles.contentColor;
  const font = global.fontFamily;

  return (
    <View>
      {data.items.map((item, idx) => (
        <View
          key={item.id}
          style={{ marginBottom: idx < data.items.length - 1 ? styles.itemSpacing : 0 }}
        >
          {/* Row 1: Institution (left) | Date (right) */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontSize: fs, fontFamily: font, fontWeight: 'bold', color }}>
              {item.institution}
            </Text>
            <Text style={{ fontSize: global.dateFontSize ?? 9, fontFamily: font, color, fontWeight: global.dateBold ? 'bold' : 'normal', flexShrink: 0 }}>
              {item.startDate}{item.startDate && (item.current || item.endDate) ? ' – ' : ''}
              {item.current ? 'Present' : item.endDate}
            </Text>
          </View>

          {/* Row 2: Degree + GPA (left) | Location (right) */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontSize: fs, fontFamily: font, color: global.secondaryColor, fontStyle: 'italic' }}>
              {[item.degree, item.field].filter(Boolean).join(' in ')}
              {item.gpa ? `  ·  ${item.gpa}` : ''}
            </Text>
            {item.location ? (
              <Text style={{ fontSize: global.locationFontSize ?? 9, fontFamily: font, color, fontWeight: global.locationBold ? 'bold' : 'normal', flexShrink: 0, marginLeft: 8 }}>
                {item.location}
              </Text>
            ) : null}
          </View>

          {/* Bullets — full width */}
          {item.bullets.filter(Boolean).map((bullet, i) => (
            <View key={i} style={{ marginTop: 2, paddingLeft: 10 }}>
              <Text style={{ fontSize: fs, fontFamily: font, color, lineHeight: global.lineHeight }}>
                {'• ' + bullet}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
