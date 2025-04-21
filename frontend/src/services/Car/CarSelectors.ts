import { RootState } from "../../app/store";

const selectCarList = (state: RootState) => state.car.cars;
const selectCarIsLoading = (state: RootState) => state.car.isLoading;
const selectCarError = (state: RootState) => state.car.error;

export { selectCarList, selectCarIsLoading, selectCarError };