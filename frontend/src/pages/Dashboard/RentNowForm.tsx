// import { useNavigate, useParams } from "react-router";
// import { dashboard } from "../../routes";

// function RentNowForm() {
//     console.log("RentNowForm component rendered");
//     const navigate = useNavigate();
//     const { carId } = useParams<{ carId: string }>();
//     console.log("Car ID from params:", carId);
//     if (!carId) {
//         navigate(dashboard);
//         return null;
//     }
//     const carIdNumber = parseInt(carId, 10);
//     return <div className="app-container">
//         <h1>Rent Now Form for Car ID: {carIdNumber}</h1>
//         {/* Here you can add the form fields and logic to handle the rental process */}
//         <p>This is where the form for renting the car will be implemented.</p>
//         <button onClick={() => navigate(dashboard)}>Back to Dashboard</button>
//     </div>
// }

// export default RentNowForm;

import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { dashboard } from "../../routes";

function RentNowForm() {
    const navigate = useNavigate();
    const { carId } = useParams<{ carId: string }>();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [summary, setSummary] = useState<any>(null);
    const [customerId, setCustomerId] = useState(""); 
    if (!carId) {
        navigate(dashboard);
        return null;
    }

    const handleCheckAvailability = async () => {
        const response = await fetch("/booking/summary", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customer_id: customerId,
                car_id: parseInt(carId),
                start_date: startDate,
                end_date: endDate
            })
        });
        const result = await response.json();
        if (response.ok) {
            setSummary(result);
        } else {
            alert(result.message || "Booking check failed.");
        }
    };

    const handleConfirmBooking = async () => {
        const response = await fetch("/booking/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customer_id: customerId,
                car_id: parseInt(carId),
                start_date: startDate,
                end_date: endDate
            })
        });

        if (response.ok) {
            alert("Booking confirmed!");
            navigate(dashboard);
        } else {
            const error = await response.json();
            alert(error.message || "Booking failed.");
        }
    };

    return (
        <div className="app-container">
            <h1>Rent Now - Car ID: {carId}</h1>

            <label>
                Customer ID:
                <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
            </label>

            <label>
                Start Date:
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>

            <label>
                End Date:
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </label>

            <button onClick={handleCheckAvailability}>Check Availability & Price</button>

            {summary && (
                <div>
                    <h2>Summary</h2>
                    <p>Customer: {summary.customer_name}</p>
                    <p>Total Payment: ${summary.total_payment}</p>
                    <p>Insurance: ${summary.insurance_val}</p>
                    {summary.discount_price && <p>Discounted Daily Rate: ${summary.discount_price}</p>}
                    <button onClick={handleConfirmBooking}>Confirm Booking</button>
                </div>
            )}

            <button onClick={() => navigate(dashboard)}>Back to Dashboard</button>
        </div>
    );
}

// We need to run the followung command and ensure how does it work 
export default RentNowForm;
