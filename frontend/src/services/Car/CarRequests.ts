import apiEndpoints from "../../data/environment";
import Car from "../../types/Car/Car";

async function carRequest(): Promise<Car[]> {
    const response = await fetch(apiEndpoints.car);
    if (response.ok) {
        return Promise.resolve(response.json());
    }
    const errorMessage = await response.text();
    return Promise.reject(new Error(errorMessage));
}

export default carRequest;