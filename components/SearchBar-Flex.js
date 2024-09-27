import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { FaSearch } from 'react-icons/fa'; // Import a search icon from react-icons

const SearchBarFlex = ({ posts, onSearchResults }) => {
  const [query, setQuery] = useState('');

  const handleSearch = (event) => {

    setQuery(event.target.value.toLowerCase());
    const latestQuery = event.target.value.toLowerCase();

    console.log('Searching for:', latestQuery);

    const filteredPosts = posts.filter(post =>
      post.title.toLowerCase().includes(latestQuery) ||
      post.excerpt.toLowerCase().includes(latestQuery)
    );

    onSearchResults(filteredPosts);

  };

  return (
    <div className="d-flex justify-content-center my-4">
      <div className="input-group" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="input-group-prepend">
          <span 
            className="input-group-text bg-transparent text-muted d-flex align-items-center justify-content-center" 
            id="basic-addon1" 
            style={{
              borderColor: 'transparent',
              cursor: 'pointer',
              transition: 'color 0.3s ease, background-color 0.3s ease',
              height: '100%',
              padding: '0.5rem',
              display: 'flex'
            }}
          >
            <FaSearch style={{ fontSize: '1.2rem', margin: '0' }} />
          </span>
        </div>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search posts..."
          className="form-control"
          aria-label="Search"
          aria-describedby="basic-addon1"
          style={{
            border: '1px solid #ddd',
            borderRadius: '30px',
            padding: '0.75rem 1.5rem',
            transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
          }}
          onFocus={(e) => e.target.style.borderColor = '#FF5733'}
          onBlur={(e) => e.target.style.borderColor = '#ddd'}
        />
      </div>
      <style jsx>{`
        .input-group-text:hover {
          color: #ff5733;
          background-color: #f7f7f7;
        }
        input.form-control:focus {
          box-shadow: 0 0 10px rgba(255, 87, 51, 0.2);
        }
      `}</style>
    </div>
  );
  
};

export default SearchBarFlex;
