import { View, Text, Link } from '@react-pdf/renderer';
import type { ProjectsData, SectionStyles, GlobalStyles } from '../types';

interface Props {
  data: ProjectsData;
  styles: SectionStyles;
  global: GlobalStyles;
}

export function PdfProjects({ data, styles, global }: Props) {
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
          {/* Name + Link */}
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
            <Text style={{ fontSize: fs, fontFamily: font, fontWeight: 'bold', color }}>
              {item.name}
            </Text>
            {item.link ? (
              <Link
                src={item.link.startsWith('http') ? item.link : `https://${item.link}`}
                style={{ fontSize: fs - 1, color: global.secondaryColor, fontFamily: font }}
              >
                {item.link}
              </Link>
            ) : null}
          </View>

          {/* Tech stack */}
          {item.tech ? (
            <Text style={{ fontSize: fs - 1, fontFamily: font, color: global.secondaryColor, fontStyle: 'italic', marginTop: 1 }}>
              {item.tech}
            </Text>
          ) : null}

          {/* Description */}
          {item.description ? (
            <Text style={{ fontSize: fs, fontFamily: font, color, marginTop: 2, lineHeight: global.lineHeight }}>
              {item.description}
            </Text>
          ) : null}

          {/* Bullets */}
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
