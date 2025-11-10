import { createSlice } from '@reduxjs/toolkit';

const langAppSlice = createSlice({
  name: 'langApp',
  initialState: {
    lang: localStorage.getItem('lang') || 'pt',
  },
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload;
    },
  },
});

export const { setLanguage } = langAppSlice.actions;
export default langAppSlice.reducer;
