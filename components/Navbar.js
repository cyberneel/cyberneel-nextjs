import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  
  const [pages, setPages] = useState([]);
  
  useEffect(() => {
    fetch('/pages.json')
      .then(response => response.json())
      .then(data => setPages(data));
  }, []);

  const renderMenuItems = (items, drop=false) => {
    return items.map((item, index) => {
      if (item.test) {
        return null;
      }
      if (item.children) {
        return (
          <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {item.label}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                {renderMenuItems(item.children,true)}
              </ul>
            </li>
        );
      }
      
      if (drop == true) {
        return (
          <li><a className="dropdown-item" href={item.path}>{item.label}</a></li>
        );
      }
      
      return (
        <li key={index} className='nav-item'>
            <a className='nav-link' href={item.path}>{item.label}</a>
        </li>
      );
    });
  };
  
  return (
    <>
      <nav className="navbar navbar-expand-lg rounded-3">
        <a className="navbar-brand px-3" href="/">CyberNeel</a>
        <button
          className="navbar-toggler mx-3"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            {renderMenuItems(pages)}
          </ul>
        </div>
      </nav>
    </>
  );
}