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
          {/* Institution + Date */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontSize: fs, fontFamily: font, fontWeight: 'bold', color }}>
              {item.institution}
            </Text>
            <Text style={{ fontSize: fs - 1, fontFamily: font, color, flexShrink: 0 }}>
              {item.startDate}{item.startDate && (item.current || item.endDate) ? ' – ' : ''}
              {item.current ? 'Present' : item.endDate}
            </Text>
          </View>

          {/* Degree + Location */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontSize: fs, fontFamily: font, color: global.secondaryColor, fontStyle: 'italic' }}>
              {[item.degree, item.field].filter(Boolean).join(' in ')}
              {item.gpa ? `  ·  GPA: ${item.gpa}` : ''}
            </Text>
            {item.location ? (
              <Text style={{ fontSize: fs - 1, fontFamily: font, color, flexShrink: 0 }}>
                {item.location}
              </Text>
            ) : null}
          </View>

          {item.bullets.filter(Boolean).map((bullet, i) => (
            <View key={i} style={{ flexDirection: 'row', marginTop: 2, paddingLeft: 10 }}>
              <Text style={{ fontSize: fs, fontFamily: font, color, marginRight: 4 }}>•</Text>
              <Text style={{ fontSize: fs, fontFamily: font, color, flex: 1, lineHeight: global.lineHeight }}>
                {bullet}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
