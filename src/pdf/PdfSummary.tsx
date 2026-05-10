import { View, Text } from '@react-pdf/renderer';
import type { SummaryData, SectionStyles, GlobalStyles } from '../types';

interface Props {
  data: SummaryData;
  styles: SectionStyles;
  global: GlobalStyles;
}

export function PdfSummary({ data, styles, global }: Props) {
  return (
    <Text
      style={{
        fontSize: styles.contentFontSize,
        color: styles.contentColor,
        fontFamily: global.fontFamily,
        lineHeight: global.lineHeight,
      }}
    >
      {data.text}
    </Text>
  );
}
