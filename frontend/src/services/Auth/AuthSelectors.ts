import { RootState } from "../../app/store";

const selectAuthUser = (state: RootState) => state.auth.user;
const selectAuthIsLoading = (state: RootState) => state.auth.isLoading;
const selectAuthError = (state: RootState) => state.auth.error;

export { selectAuthUser, selectAuthIsLoading, selectAuthError };
