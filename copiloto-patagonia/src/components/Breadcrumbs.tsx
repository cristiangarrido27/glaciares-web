import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export interface Crumb {
  label: string;
  to?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  useEffect(() => {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: item.label,
        ...(item.to ? { item: `${window.location.origin}${item.to}` } : {}),
      })),
    };
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      script.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.map((i) => i.label).join('|')]);

  return (
    <nav aria-label="Ruta de navegación" className="mx-auto max-w-7xl px-4 pt-4 text-xs text-rock/60 lg:px-8">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, idx) => (
          <li key={item.label} className="flex items-center gap-1">
            {idx > 0 && <span aria-hidden="true">/</span>}
            {item.to ? (
              <Link to={item.to} className="hover:text-glacial-dark hover:underline">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-semibold text-rock">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
