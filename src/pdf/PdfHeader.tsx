import { View, Text } from '@react-pdf/renderer';
import type { HeaderData, GlobalStyles } from '../types';

interface Props {
  data: HeaderData;
  global: GlobalStyles;
}

export function PdfHeader({ data, global }: Props) {
  const { name, title, email, phone, location, linkedin, website,
    nameSize, nameColor, titleSize, titleColor,
    contactSize, contactColor, alignment, separator } = data;

  const contactParts = [email, phone, location, linkedin, website].filter(Boolean);

  return (
    <View style={{ marginBottom: 4 }}>
      <Text
        style={{
          fontSize: nameSize,
          color: nameColor,
          fontFamily: global.fontFamily,
          fontWeight: 'bold',
          textAlign: alignment,
          letterSpacing: 0.5,
        }}
      >
        {name}
      </Text>

      {title ? (
        <Text
          style={{
            fontSize: titleSize,
            color: titleColor,
            fontFamily: global.fontFamily,
            textAlign: alignment,
            marginTop: 2,
          }}
        >
          {title}
        </Text>
      ) : null}

      {contactParts.length > 0 && (
        <Text
          style={{
            fontSize: contactSize,
            color: contactColor,
            fontFamily: global.fontFamily,
            textAlign: alignment,
            marginTop: 4,
          }}
        >
          {contactParts.join(separator)}
        </Text>
      )}
    </View>
  );
}
