// src/components/help/Breadcrumbs.tsx
import Link from "next/link";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-sm text-gray-500 mb-4 flex flex-wrap gap-1"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center">
            {index > 0 && <span className="mx-1 text-gray-400">/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-cyan-700">
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-700">
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
