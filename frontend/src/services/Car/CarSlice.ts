import { ActionReducerMapBuilder, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Car from "../../types/Car/Car";
import carRequest from "./CarRequests";

interface CarState {
    cars: Car[];
    isLoading: boolean;
    error: string;
}

function getInitialCarState(): CarState {
    const carState: CarState = {
        cars: [],
        isLoading: false,
        error: "",
    };
    return carState;
}

const getCars = createAsyncThunk<Car[], undefined>(
    "car/fetch",
    async () => {
        return await carRequest();
    }
);

const carSlice = createSlice({
    name: "car",
    initialState: getInitialCarState(),
    reducers: {},
    extraReducers: (builder: ActionReducerMapBuilder<CarState>) => {
        builder
            .addCase(getCars.pending, (state) => {
                state.isLoading = true;
                state.error = "";
            })
            .addCase(getCars.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cars = action.payload;
            })
            .addCase(getCars.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message || "Failed to fetch cars";
            });
    },
});

export const carReducer = carSlice.reducer;

export { getCars }
export default carReducer;