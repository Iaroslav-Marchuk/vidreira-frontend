import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import css from './SearchBox.module.css';

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(query.trim());
    }, 500);

    return () => clearTimeout(handler);
  }, [query, onSearch]);

  return (
    <div className={css.searchbox}>
      <input
        className={css.input}
        type="text"
        placeholder="Digite número EP ou nome do cliente..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <Search className={css.inputIcon} />
    </div>
  );
};

export default SearchBox;
