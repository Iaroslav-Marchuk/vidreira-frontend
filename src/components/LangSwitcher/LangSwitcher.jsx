import { useDispatch, useSelector } from 'react-redux';
import { changeLang } from '../../redux/lang/operations.js';
import { selectLangApp } from '../../redux/lang/selectors.js';

const LangSwitcher = () => {
  const dispatch = useDispatch();

  const lang = useSelector(selectLangApp);
  const handleChange = e => {
    dispatch(changeLang(e.target.value));
  };
  return (
    <select value={lang} onChange={handleChange}>
      <option value="pt">PT</option>
      <option value="en">EN</option>
      <option value="uk">UA</option>
    </select>
  );
};

export default LangSwitcher;
