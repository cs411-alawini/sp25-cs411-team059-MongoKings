import {
  ActionReducerMapBuilder,
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";
import User from "../../types/Authentication/User";
import LoginInput from "../../types/Authentication/LoginInput";
import { loginRequest, logoutRequest, registerRequest } from "./AuthRequests";
import { RootState } from "../../app/store";
import RegisterInput from "../../types/Authentication/RegisterInput";

interface AuthUserState {
  user: User | null;
  isLoading: boolean;
  error: string;
}

function getInitialAuthUserState(): AuthUserState {
  const authUserState: AuthUserState = {
    user: null,
    isLoading: false,
    error: "",
  };
  if (localStorage.getItem("user")) {
    authUserState.user = JSON.parse(localStorage.getItem("user") || "");
  }
  return authUserState;
}

const register = createAsyncThunk<string, RegisterInput>(
  "user/register",
  async (registerDetails: RegisterInput) => {
    return await registerRequest(registerDetails);
  }
);

const login = createAsyncThunk<User, LoginInput>(
  "user/login",
  async (loginDetails: LoginInput) => {
    return await loginRequest(loginDetails);
  }
);

const logout = createAsyncThunk<string, undefined, { state: RootState }>(
  "user/logout",
  async (_, { getState }) => {
    const user = getState().auth.user;
    if (!user) {
      return Promise.reject(new Error("User not logged in"));
    }
    return await logoutRequest(user);
  }
);

const authSlice = createSlice({
  name: "authentication",
  initialState: getInitialAuthUserState(),
  reducers: {},
  extraReducers: (builder: ActionReducerMapBuilder<AuthUserState>) => {
    builder
      .addCase(login.pending, (state) => {
        state.user = null;
        state.isLoading = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.error = "";
      })
      .addCase(login.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = "Username or password may be incorrect";
      });
      builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = "";
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = "Unable to logout";
      });

  },
});

const authReducer = authSlice.reducer;

export {  login, logout, register };
export default authReducer;
