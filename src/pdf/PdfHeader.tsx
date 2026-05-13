import { View, Text, Link } from '@react-pdf/renderer';
import type { HeaderData, GlobalStyles } from '../types';

function toUrl(raw: string): string {
  return raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
}

function displayUrl(raw: string): string {
  return raw.replace(/^https?:\/\//, '');
}

interface Props {
  data: HeaderData;
  global: GlobalStyles;
}

export function PdfHeader({ data, global }: Props) {
  const { name, title, email, phone, location, linkedin, linkedinLabel, website, websiteLabel,
    nameSize, nameColor, titleSize, titleColor,
    contactSize, contactColor } = data;

  const contactStyle = {
    fontSize: contactSize,
    color: contactColor,
    fontFamily: global.fontFamily,
    lineHeight: 1.5,
  };

  return (
    <View style={{ paddingTop: 2, paddingBottom: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {/* Left: email, phone, location — top-aligned */}
        <View style={{ flex: 1, justifyContent: 'center' }}>
          {email ? <Text style={contactStyle}>{email}</Text> : null}
          {phone ? <Text style={contactStyle}>{phone}</Text> : null}
          {location ? <Text style={contactStyle}>{location}</Text> : null}
        </View>

        {/* Center: name and title */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: nameSize,
              color: nameColor,
              fontFamily: global.fontFamily,
              fontWeight: 'bold',
              textAlign: 'center',
              letterSpacing: 1,
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
                textAlign: 'center',
                marginTop: 3,
              }}
            >
              {title}
            </Text>
          ) : null}
        </View>

        {/* Right: linkedin and website — top-aligned */}
        <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
          {linkedin ? (
            <Link src={toUrl(linkedin)} style={{ ...contactStyle, textDecoration: 'underline', color: contactColor }}>
              {linkedinLabel || 'LinkedIn'}
            </Link>
          ) : null}
          {website ? (
            <Link src={toUrl(website)} style={{ ...contactStyle, textDecoration: 'underline', color: contactColor }}>
              {websiteLabel || displayUrl(website)}
            </Link>
          ) : null}
        </View>
      </View>

    </View>
  );
}
