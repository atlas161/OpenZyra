import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Fil d'Ariane" className="w-full">
      <ol 
        itemScope 
        itemType="https://schema.org/BreadcrumbList"
        className="flex flex-wrap items-center gap-2 text-sm"
      >
        {/* Home link - always present */}
        <li 
          itemProp="itemListElement" 
          itemScope 
          itemType="https://schema.org/ListItem"
          className="flex items-center"
        >
          <button
            onClick={items[0]?.onClick || (() => window.location.hash = '')}
            itemProp="item"
            className="flex items-center gap-1.5 text-slate-500 hover:text-[#5087FF] transition-colors group"
          >
            <Home size={16} className="group-hover:scale-110 transition-transform" />
            <span itemProp="name" className="sr-only">Accueil</span>
          </button>
          <meta itemProp="position" content="1" />
        </li>

        {/* Separator and other items */}
        {items.slice(1).map((item, index) => (
          <React.Fragment key={index}>
            <li>
              <ChevronRight size={16} className="text-slate-300" />
            </li>
            <li 
              itemProp="itemListElement" 
              itemScope 
              itemType="https://schema.org/ListItem"
              className="flex items-center"
            >
              {item.onClick || item.href ? (
                <button
                  onClick={item.onClick}
                  itemProp="item"
                  className="text-slate-500 hover:text-[#5087FF] transition-colors hover:underline"
                >
                  <span itemProp="name">{item.label}</span>
                </button>
              ) : (
                <span 
                  itemProp="name"
                  className="text-slate-700 font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={`${index + 2}`} />
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
