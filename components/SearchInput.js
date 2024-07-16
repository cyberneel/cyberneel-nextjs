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
    <form onSubmit={handleSubmit} className="search-form md-col-3">
      <input
        class=""
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search by tags, title, or description"
      />
      <button type="submit" className="rounded-3">Search</button>
      <style jsx>{`
        .search-form {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        input {
          flex: 1;
          padding: 10px;
          max-width: 300px;
          font-size: 16px;
        }
        button {
          padding: 10px;
          font-size: 16px;
          background-color: #ff6b6b;
        }
      `}</style>
    </form>
  );
};

export default SearchInput;
