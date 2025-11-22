import i18next from 'i18next';
import { setLanguage } from './slice.js';

export const changeLang = lang => dispatch => {
  localStorage.setItem('lang', lang);
  i18next.changeLanguage(lang);
  dispatch(setLanguage(lang));
};
