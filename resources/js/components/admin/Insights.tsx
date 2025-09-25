import React from 'react';
import '@/../css/Insights.css';

interface InsightItem {
  icon: string;
  value: string | number;
  label: string;
}

interface InsightsProps {
  items: InsightItem[];
}

export default function Insights({ items }: InsightsProps) {
  return (
    <ul className="insights">
      {items.map((item, index) => (
        <li key={index}>
          <i className={`bx ${item.icon}`}></i>
          <span className="info">
            <h3>{item.value}</h3>
            <p>{item.label}</p>
          </span>
        </li>
      ))}
    </ul>
  );
}
