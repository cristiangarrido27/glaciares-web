import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  jsonLd?: object | object[];
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, name);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}

export default function Seo({ title, description, jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes('Copiloto Patagonia') ? title : `${title} | Copiloto Patagonia`;
    document.title = fullTitle;
    setMeta('description', description);
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description, 'property');

    const scripts: HTMLScriptElement[] = [];
    if (jsonLd) {
      const entries = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      entries.forEach((entry) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(entry);
        document.head.appendChild(script);
        scripts.push(script);
      });
    }
    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [title, description, jsonLd]);

  return null;
}
