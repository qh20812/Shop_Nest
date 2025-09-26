import React from 'react';
import '@/../css/Page.css';

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface HeadProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  reportButton?: {
    label: string;
    icon: string;
    onClick?: () => void;
  };
}

export default function Header({ title, breadcrumbs, reportButton }: HeadProps) {
  return (
    <div className="header">
      <div className="left">
        <h1>{title}</h1>
        <ul className="breadcrumb">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <li>
                {item.href ? (
                  <a href={item.href} className={item.active ? 'active' : ''}>
                    {item.label}
                  </a>
                ) : (
                  <span className={item.active ? 'active' : ''}>{item.label}</span>
                )}
              </li>
              {index < breadcrumbs.length - 1 && <span>/</span>}
            </React.Fragment>
          ))}
        </ul>
      </div>
      
      {reportButton && (
        <a href="#" className="report" onClick={reportButton.onClick}>
          <i className={`bx ${reportButton.icon}`}></i>
          <span>{reportButton.label}</span>
        </a>
      )}
    </div>
  );
}
