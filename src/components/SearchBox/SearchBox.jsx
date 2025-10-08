import { useState } from 'react';
import { Search, CircleX } from 'lucide-react';
import css from './SearchBox.module.css';
import Button from '../Button/Button.jsx';

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleInputChange = e => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery === '') {
      onSearch('');
    }
  };

  return (
    <div className={css.wrapper}>
      <div className={css.searchbox}>
        <Search className={css.inputIcon} />
        <input
          className={css.input}
          type="text"
          placeholder="Digite número EP ou nome do cliente..."
          value={query}
          onChange={handleInputChange}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />

        {query.length > 0 && (
          <button type="button" onClick={handleClear} className={css.clear}>
            <CircleX size={24} strokeWidth={1} />
          </button>
        )}
      </div>
      <Button className={css.search} onClick={handleSearch}>
        Procurar
      </Button>
    </div>
  );
};

export default SearchBox;
