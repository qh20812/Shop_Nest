import React from 'react';
import '@/../css/Insights.css';

interface InsightsProps {
    value: number;
    title: string;
}

export default function Insights({ value, title }: InsightsProps) {
  return (
    <ul className='insights'>
      <li>
        <i className='bx bx-calendar-check'></i>
        <span className='info'>
            <h3>
                {value}
            </h3>
            <p>{title}</p>
        </span>
      </li>
      <li>
        <i className='bx bx-show-alt'></i>
        <span className='info'>
            <h3>
                {value}
            </h3>
            <p>{title}</p>
        </span>
      </li>
      <li>
        <i className='bx bx-line-chart'></i>
        <span className='info'>
            <h3>
                {value}
            </h3>
            <p>{title}</p>
        </span>
      </li>
      <li>
        <i className='bx bx-dollar-circle'></i>
        <span className='info'>
            <h3>
                {value}
            </h3>
            <p>{title}</p>
        </span>
      </li>
    </ul>
  )
}
