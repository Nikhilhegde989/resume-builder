import { Text, Link } from '@react-pdf/renderer';

type Segment =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'link'; content: string; href: string }
  | { type: 'boldlink'; content: string; href: string };

function parseRichText(text: string): Segment[] {
  const segments: Segment[] = [];
  // bold-link must come first — it's more specific than either bold or link alone
  const regex = /\*\*\[([^\]]+)\]\(([^)]+)\)\*\*|\*\*(.*?)\*\*|\[([^\]]+)\]\(([^)]+)\)/gs;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      // **[text](url)**
      segments.push({ type: 'boldlink', content: match[1], href: match[2] });
    } else if (match[3] !== undefined) {
      // **text**
      segments.push({ type: 'bold', content: match[3] });
    } else {
      // [text](url)
      segments.push({ type: 'link', content: match[4], href: match[5] });
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}

function toHref(raw: string): string {
  return raw.startsWith('http') ? raw : `https://${raw}`;
}

export function renderRichText(text: string, baseStyle: object) {
  const segments = parseRichText(text);
  if (segments.length === 1 && segments[0].type === 'text') {
    return <Text style={baseStyle}>{text}</Text>;
  }
  return (
    <Text style={baseStyle}>
      {segments.map((seg, i) => {
        if (seg.type === 'bold') {
          return <Text key={i} style={{ fontWeight: 'bold' }}>{seg.content}</Text>;
        }
        if (seg.type === 'link') {
          return (
            <Link key={i} src={toHref(seg.href)} style={{ textDecoration: 'underline', color: 'inherit' }}>
              {seg.content}
            </Link>
          );
        }
        if (seg.type === 'boldlink') {
          return (
            <Link key={i} src={toHref(seg.href)} style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'inherit' }}>
              {seg.content}
            </Link>
          );
        }
        return <Text key={i}>{seg.content}</Text>;
      })}
    </Text>
  );
}
