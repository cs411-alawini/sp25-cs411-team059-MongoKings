import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { dashboard } from "../../routes";
import apiEndpoints from "../../data/environment";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../services/Auth/AuthSelectors";

function RentNowForm() {
    const navigate = useNavigate();
    const { carId } = useParams<{ carId: string }>();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [summary, setSummary] = useState<any>(null);
    const user = useAppSelector(selectAuthUser);

    if (!carId) {
        navigate(dashboard);
        return null;
    }

    const handleCheckAvailability = async () => {
        try {
            if (user === null) {
                alert("Please log in to check availability.");
                return;
            }
            const response = await fetch(apiEndpoints.bookingSummary, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    car_id: parseInt(carId),
                    start_date: startDate,
                    end_date: endDate,
                    customer_id: user.customer_id
                })
            });
    
            const result = await response.json();
    
            if (response.ok) {
                setSummary(result);
            } else {
                console.error("Booking summary error:", result);
                alert(result.message || "Booking check failed.");
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert("An unexpected error occurred. Check console for details.");
        }
    };

    const handleConfirmBooking = async () => {
        const response = await fetch(apiEndpoints.bookingConfirm, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                car_id: parseInt(carId),
                start_date: startDate,
                end_date: endDate,
                customer_id: user?.customer_id,
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

export default RentNowForm;