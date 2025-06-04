import Head from 'next/head';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Styles from './Navbar.module.css';
import { Menu, Home, ChevronDown } from 'lucide-react';

export default function Navbar() {
  
  const [pages, setPages] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    fetch('/pages.json')
      .then(response => response.json())
      .then(data => setPages(data))
      .catch(error => console.error('Error:', error));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderMenuItems = (items, drop=false) => {
    return items.map((item, index) => {
      if (item.test) {
        return null;
      }
      if (item.children) {
        return (
          <li key={index} className="nav-item dropdown">
              <a
                className={`nav-link dropdown-toggle d-flex align-items-center ${Styles.navItem}`}
                href="#"
                id="navbarDropdownMenuLink"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {item.label} <ChevronDown className="ms-1" size={16} />
              </a>
              <ul className={`dropdown-menu ${Styles.dropdownMenu}`} aria-labelledby="navbarDropdownMenuLink">
                {renderMenuItems(item.children, true)}
              </ul>
            </li>
        );
      }
      
      if (drop === true) {
        return (
          <li key={index}>
            <a className={`${Styles.navItem} ${Styles.dropdownItem} dropdown-item`} href={item.path}>
              {item.label}
            </a>
          </li>
        );
      }
      
      return (
        <li key={index} className='nav-item'>
          <a 
            className={`${Styles.navItem} nav-link d-flex align-items-center`} 
            href={item.path}
          >
            {item.path === '/' && <Home size={16} className="me-1" />}
            {item.label}
          </a>
        </li>
      );
    });
  };
  
  return (
    <>
      <nav className={`navbar navbar-expand-lg rounded-3 ${Styles.navContainer} ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="container-fluid position-relative">
          <a className={`navbar-brand ${Styles.navBrand}`} href="/">
            <img 
              className={Styles.navLogo} 
              src="https://cyberneel.github.io/img/CyberNeelLogoNewOutfit1080p-1400x1400.webp" 
              alt="CyberNeel Logo" 
              width="30" 
              height="30"
            />
            <span className="ms-2">CyberNeel</span>
          </a>
          
          <button
            className={`navbar-toggler ${Styles.mobileMenuButton}`}
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <Menu size={24} />
          </button>
          
          <div className={`collapse navbar-collapse ${Styles.linksContainer}`} id="navbarNavDropdown">
            <ul className={`navbar-nav ${Styles.navLinks}`}>
              {renderMenuItems(pages)}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
