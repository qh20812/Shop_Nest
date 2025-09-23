import React from 'react'
import '@/../css/Navbar.css';
import '@/../css/app.css';

export default function Navbar() {
    return (
        <nav>
            <i className='bx bx-menu'></i>
            <form action="#">
                <div className="form-input">
                    <input type="search" placeholder='Tìm kiếm...' />
                    <button className='search-btn' type='submit'><i className='bx bx-search'></i></button>
                </div>
            </form>
            <a href="#" className='notif'>
                <i className='bx bx-bell'></i>
                <span className='count'>12</span>
            </a>
            <a href="#" className='profile'>
                <img src="#" alt="#" />
            </a>
        </nav>
    )
}
