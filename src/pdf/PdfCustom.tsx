import { View, Text } from '@react-pdf/renderer';
import type { CustomData, SectionStyles, GlobalStyles } from '../types';

interface Props {
  data: CustomData;
  styles: SectionStyles;
  global: GlobalStyles;
}

export function PdfCustom({ data, styles, global }: Props) {
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontSize: fs, fontFamily: font, fontWeight: 'bold', color }}>
              {item.title}
            </Text>
            {item.date ? (
              <Text style={{ fontSize: fs - 1, fontFamily: font, color, flexShrink: 0 }}>
                {item.date}
              </Text>
            ) : null}
          </View>

          {item.subtitle ? (
            <Text style={{ fontSize: fs, fontFamily: font, color: global.secondaryColor, fontStyle: 'italic', marginTop: 1 }}>
              {item.subtitle}
            </Text>
          ) : null}

          {item.content ? (
            <Text style={{ fontSize: fs, fontFamily: font, color, marginTop: 2, lineHeight: global.lineHeight }}>
              {item.content}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}
