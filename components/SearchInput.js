import { useState } from 'react';

const SearchInput = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search by tags, title, or description"
      />
      <button type="submit">Search</button>
      <style jsx>{`
        .search-form {
          display: flex;
          margin-bottom: 20px;
        }
        input {
          flex: 1;
          padding: 10px;
          font-size: 16px;
        }
        button {
          padding: 10px;
          font-size: 16px;
        }
      `}</style>
    </form>
  );
};

export default SearchInput;
