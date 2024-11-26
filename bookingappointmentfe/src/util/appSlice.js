import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: null,
    loading: false,
    error: null
  };
  
  const appSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
      setUser: (state, action) => {
        state.user = action.payload;
      },
      setLoading: (state, action) => {
        state.loading = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
      }
    }
  });
  
  export const { setUser, setLoading, setError } = appSlice .actions;
  
  export default appSlice .reducer;