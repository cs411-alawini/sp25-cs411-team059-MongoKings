import { useNavigate, useParams } from "react-router";
import { dashboard } from "../../routes";

function RentNowForm() {
    console.log("RentNowForm component rendered");
    const navigate = useNavigate();
    const { carId } = useParams<{ carId: string }>();
    console.log("Car ID from params:", carId);
    if (!carId) {
        navigate(dashboard);
        return null;
    }
    const carIdNumber = parseInt(carId, 10);
    return <div className="app-container">
        <h1>Rent Now Form for Car ID: {carIdNumber}</h1>
        {/* Here you can add the form fields and logic to handle the rental process */}
        <p>This is where the form for renting the car will be implemented.</p>
        <button onClick={() => navigate(dashboard)}>Back to Dashboard</button>
    </div>
}

export default RentNowForm;
