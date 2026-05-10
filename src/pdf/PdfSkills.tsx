import { View, Text } from '@react-pdf/renderer';
import type { SkillsData, SectionStyles, GlobalStyles } from '../types';

interface Props {
  data: SkillsData;
  styles: SectionStyles;
  global: GlobalStyles;
}

export function PdfSkills({ data, styles, global }: Props) {
  const fs = styles.contentFontSize;
  const color = styles.contentColor;
  const font = global.fontFamily;

  if (data.layout === 'categories') {
    return (
      <View>
        {data.categories.map((cat, idx) => (
          <View
            key={cat.id}
            style={{
              flexDirection: 'row',
              marginBottom: idx < data.categories.length - 1 ? 3 : 0,
            }}
          >
            {cat.category ? (
              <Text style={{ fontSize: fs, fontFamily: font, fontWeight: 'bold', color, width: 90, flexShrink: 0 }}>
                {cat.category}:
              </Text>
            ) : null}
            <Text style={{ fontSize: fs, fontFamily: font, color, flex: 1, lineHeight: global.lineHeight }}>
              {cat.skills}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  // list layout: all skills as a single comma-separated line
  const allSkills = data.categories.map(c => c.skills).filter(Boolean).join(', ');
  return (
    <Text style={{ fontSize: fs, fontFamily: font, color, lineHeight: global.lineHeight }}>
      {allSkills}
    </Text>
  );
}
