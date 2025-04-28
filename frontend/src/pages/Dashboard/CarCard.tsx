import { useNavigate } from "react-router";
import Car from "../../types/Car/Car";
import { dashboardCar } from "../../routes";

const carImages = [
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500", // Classic car
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500", // Sports car
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=500", // Mustang
  "https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=500", // SUV
  "https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=500", // Luxury sedan
  "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?q=80&w=500", // Vintage car
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=500", // Tesla
  "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?q=80&w=500", // Off-road
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=500", // Lamborghini
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500"  // Corvette
];

function CarCard(car: Car) {
    const navigate = useNavigate();
    const onClick = (carId: number) => {
        console.log(`${dashboardCar}/${carId}`);
        navigate(`${dashboardCar}/${carId}`);
    };
    
    // Choose image based on Car_Id for consistency
    const imageIndex = car.Car_Id % carImages.length;
    const carImage = carImages[imageIndex];

    return (
        <div key={car.Car_Id} className="car-card">
            <div className="car-card-image">
                <img src={carImage} alt={`${car.Vehicle_Make} ${car.Vehicle_Model}`} />
            </div>
            <div className="car-card-details">
                <h3>{car.Vehicle_Model} {car.Vehicle_Make}</h3>
                <p>{car.State} {car.Number_of_trips ? `- $${car.Daily_Price}` : ''}</p>
                <button className="rent-button" onClick={() => onClick(car.Car_Id)}
                >Rent now</button>
            </div>
        </div>
    );
}
export default CarCard;
