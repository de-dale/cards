import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import playgroundReducer from '../features/playground/reducer'

export const store = configureStore({
  reducer: {
    playground: playgroundReducer,
  },
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>;
