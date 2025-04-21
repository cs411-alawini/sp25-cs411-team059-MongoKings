import { useNavigate } from "react-router";
import Car from "../../types/Car/Car";
import { dashboardCar } from "../../routes";

function CarCard(car: Car) {
    const navigate = useNavigate();
    const onClick = (carId: number) => {
        navigate(`${dashboardCar}/${carId}`);
    };

    return (
        <div key={car.Car_Id} className="car-card">
            <div className="car-card-image">
                {/* <img src={car.} alt={car.name} /> */}
                <button className="view-button">View</button>
            </div>
            <div className="car-card-details">
                <h3>{car.Vehicle_Model} {car.Vehicle_Make}</h3>
                <p>{car.State} {car.Number_of_trips ? `- ${car.Daily_Price}` : ''}</p>
                <button className="rent-button" onClick={() => onClick(car.Car_Id)}
                >Rent now</button>
            </div>
        </div>
    );
}
export default CarCard;
