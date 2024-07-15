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
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{item.label}</a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
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
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNavDropdown">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="/abut">Home <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Features</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">Pricing</a>
      </li>
      <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Dropdown link
        </a>
        <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
          <a class="dropdown-item" href="#">Action</a>
          <a class="dropdown-item" href="#">Another action</a>
          <a class="dropdown-item" href="#">Something else here</a>
        </div>
      </li>
    </ul>
  </div>
</nav>
  );
};

export default Navbar;
