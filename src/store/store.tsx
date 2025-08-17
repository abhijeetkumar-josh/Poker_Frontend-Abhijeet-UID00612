import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pokercreate from './gameSlice';
import pokerReducer from './pokerSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    game:pokercreate,
    poker:pokerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch
