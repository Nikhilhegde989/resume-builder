import { View, Text, Link } from '@react-pdf/renderer';
import type { CustomData, SectionStyles, GlobalStyles } from '../types';
import { renderRichText } from './richText';

function toUrl(raw: string): string {
  return raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
}

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
          <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
            {data.showItemBullet !== false && (
              <Text style={{ fontSize: fs, fontFamily: font, color, marginRight: 6 }}>•</Text>
            )}
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              {item.link ? (
                <Link src={toUrl(item.link)} style={{ fontSize: fs, fontFamily: font, fontWeight: 'bold', color, textDecoration: 'underline' }}>
                  {item.title}
                </Link>
              ) : (
                <Text style={{ fontSize: fs, fontFamily: font, fontWeight: 'bold', color }}>
                  {item.title}
                </Text>
              )}
              {item.date ? (
                <Text style={{ fontSize: global.dateFontSize ?? 9, fontFamily: font, color, fontWeight: global.dateBold ? 'bold' : 'normal', flexShrink: 0 }}>
                  {item.date}
                </Text>
              ) : null}
            </View>
          </View>

          {item.subtitle ? (
            <Text style={{ fontSize: fs, fontFamily: font, color, marginTop: 1, textAlign: 'right' }}>
              {item.subtitle}
            </Text>
          ) : null}

          {item.content ? (
            <View style={{ flexDirection: 'row', marginTop: 1, alignItems: 'flex-start' }}>
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#000000', marginTop: 3, marginRight: 6, flexShrink: 0 }} />
              {renderRichText(item.content, { fontSize: fs, fontFamily: font, color, lineHeight: global.lineHeight, flex: 1 })}
            </View>
          ) : null}

          {(item.bullets ?? []).filter(Boolean).map((bullet, i) => (
            <View key={i} style={{ marginTop: 2, paddingLeft: 10 }}>
              {renderRichText('• ' + bullet, { fontSize: fs, fontFamily: font, fontWeight: 'normal', color, lineHeight: global.lineHeight })}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}
