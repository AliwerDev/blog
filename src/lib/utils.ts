export function cn(...classes: (string | undefined | null | boolean | Record<string, boolean>)[]) {
  const result: string[] = [];
  for (const c of classes) {
    if (!c) continue;
    if (typeof c === 'string') {
      result.push(c);
    } else if (typeof c === 'object') {
      for (const [key, value] of Object.entries(c)) {
        if (value) result.push(key);
      }
    }
  }
  return result.join(' ');
}

export function formatDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }
) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('uz-UZ', options);
  } catch {
    return dateStr;
  }
}

export function extractPreview(html: string): string {
  const text = html.replace(/<[^>]*>/g, ' ');
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= 150) return cleaned;
  return cleaned.substring(0, 150) + '...';
}

export function toHtml(text: string): string {
  return text
    .split('\n\n')
    .map((p) => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
    })
    .filter(Boolean)
    .join('');
}

export function toPlainText(html: string): string {
  if (!html) return '';
  let text = html;
  // Replace paragraph endings with double newlines
  text = text.replace(/<\/p>\s*<p>/gi, '\n\n');
  // Strip opening/closing paragraph tags
  text = text.replace(/<p>/gi, '');
  text = text.replace(/<\/p>/gi, '');
  // Convert br tags to newlines
  text = text.replace(/<br\s*\/?>/gi, '\n');
  // Strip any other tags (e.g. if created using TipTap previously)
  text = text.replace(/<[^>]*>/g, '');
  return text.trim();
}

export function getYoutubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}
