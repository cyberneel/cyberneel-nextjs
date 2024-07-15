import { useState, useEffect } from 'react';
import Link from 'next/link';
//import styles from './Navbar.module.css';

const Navbar = () => {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    fetch('/pages.json')
      .then(response => response.json())
      .then(data => setPages(data));
  }, []);


  const renderMenuItems = (items) => {
    return items.map((item, index) => {
      if (item.test) {
        return null;
      }
      if (item.children) {
        return (
          <li key={index} className={'nav-item dropdown'}>
            <a className={'nav-link dropdown-toggle'}>{item.label}</a>
            <div className={'dropdown-menu'}>
              {item.children.map((cItem) => {
                <a className={'dropdown-item'} href={cItem.path}>{cItem.label}</a>
              })}
            </div>
          </li>
        );
      }
      return (
        <li key={index} className={'nav-item'}>
          <Link href={item.path}>
            <a className={'nav-link'}>{item.label}</a>
          </Link>
        </li>
      );
    });
  };

  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Navbar</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      {renderMenuItems(pages)}
    </ul>
  </div>
</nav>
  );
};

export default Navbar;
