import React from 'react'
import '@/../css/Head.css';

interface HeadProps {
    title: string;
    parentPage: string;
    presentPage: string;
}

export default function Head({ title, parentPage, presentPage }: HeadProps) {
    return (
        <div className='header'>
            <div className="left">
                <h1>{title}</h1>
                <ul className="breadcrumb">
                    <li><a href="#">{parentPage}</a></li>/
                    <li><a href="#" className='active'>{presentPage}</a></li>
                </ul>
            </div>
            <a href="#" className='report'>
                <i className='bx bx-cloud-download'></i>
                <span>Tải xuống Báo cáo</span>
            </a>
        </div>
    )
}
