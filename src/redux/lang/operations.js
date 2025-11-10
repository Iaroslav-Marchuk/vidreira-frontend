import { setLanguage } from './languageSlice.js';

export const changeLang = lang => dispatch => {
  localStorage.setItem('lang', lang);
  dispatch(setLanguage(lang));
};
