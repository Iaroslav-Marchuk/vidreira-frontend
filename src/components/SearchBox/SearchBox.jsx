import { useState } from 'react';
import { Search, CircleX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import Button from '../Button/Button.jsx';

import css from './SearchBox.module.css';

const SearchBox = ({ onSearch }) => {
  const { t } = useTranslation();
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
          placeholder={t('SEARCH_INPUT')}
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
        {t('FIND')}
      </Button>
    </div>
  );
};

export default SearchBox;
