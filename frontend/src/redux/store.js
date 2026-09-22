import { configureStore, createSlice } from '@reduxjs/toolkit';

const savedList = JSON.parse(localStorage.getItem('streamlocal-my-list') || '[]');
const myListSlice = createSlice({
  name: 'myList', initialState: savedList,
  reducers: { toggleMyList: (state, action) => state.includes(action.payload) ? state.filter((id) => id !== action.payload) : [...state, action.payload] },
});
export const { toggleMyList } = myListSlice.actions;
export const store = configureStore({ reducer: { myList: myListSlice.reducer } });
store.subscribe(() => localStorage.setItem('streamlocal-my-list', JSON.stringify(store.getState().myList)));
