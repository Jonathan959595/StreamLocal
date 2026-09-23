import { configureStore, createSlice } from '@reduxjs/toolkit';

const savedList = JSON.parse(localStorage.getItem('streamlocal-my-list') || '[]');
const savedSession = JSON.parse(localStorage.getItem('streamlocal-session') || 'null');
const myListSlice = createSlice({
  name: 'myList', initialState: savedList,
  reducers: { toggleMyList: (state, action) => state.includes(action.payload) ? state.filter((id) => id !== action.payload) : [...state, action.payload] },
});
const authSlice = createSlice({
  name: 'auth',
  initialState: savedSession,
  reducers: {
    setSession: (_, action) => action.payload,
    clearSession: () => null,
  },
});
export const { toggleMyList } = myListSlice.actions;
export const { setSession, clearSession } = authSlice.actions;
export const store = configureStore({ reducer: { myList: myListSlice.reducer, auth: authSlice.reducer } });
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('streamlocal-my-list', JSON.stringify(state.myList));
  if (state.auth) localStorage.setItem('streamlocal-session', JSON.stringify(state.auth));
  else localStorage.removeItem('streamlocal-session');
});
