import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import authReducer from "../services/Auth/AuthSlice";
import carReducer from "../services/Car/CarSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    car: carReducer,
  },
});

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;
type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export { type AppDispatch, type RootState, type AppThunk };
export default store;
