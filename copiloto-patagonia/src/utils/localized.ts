import type { Lang, LocalizedText } from '../types';

export function L(text: LocalizedText, lang: Lang): string {
  return text[lang] ?? text.es;
}
