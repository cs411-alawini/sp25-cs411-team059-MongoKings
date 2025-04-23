import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { dashboard } from "../../routes";
import apiEndpoints from "../../data/environment";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../services/Auth/AuthSelectors";

function RentNowForm() {
    const navigate = useNavigate();
    const { carId, bookingId } = useParams<{ carId: string; bookingId?: string }>();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [summary, setSummary] = useState<any>(null);
    const user = useAppSelector(selectAuthUser);

    useEffect(() => {
        if (!carId) {
            navigate(dashboard);
            return;
        }

        // If editing, fetch booking data
        if (bookingId) {
            const fetchBookingDetails = async () => {
                try {
                    const res = await fetch(`/api/bookings/${bookingId}`);
                    if (res.ok) {
                        const data = await res.json();
                        setStartDate(data.startDate);
                        setEndDate(data.endDate);
                    } else {
                        alert("Failed to fetch booking details.");
                    }
                } catch (err) {
                    console.error("Error fetching booking:", err);
                }
            };
            fetchBookingDetails();
        }
    }, [carId, bookingId, navigate]);

    // Ensure carId exists, otherwise do not render the form
    if (!carId) return null;

    // Check availability of the car
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

    // Confirm or edit the booking
    const handleConfirmBooking = async () => {
        const url = bookingId ? `/api/bookings/${bookingId}` : apiEndpoints.bookingConfirm;
        const method = bookingId ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                car_id: parseInt(carId),
                start_date: startDate,
                end_date: endDate,
                customer_id: user?.customer_id,
                confirm: true
            })
        });

        if (response.ok) {
            alert(bookingId ? "Booking updated successfully!" : "Booking confirmed!");
            navigate(dashboard);
        } else {
            const error = await response.json();
            alert(error.message || "Booking failed.");
        }
    };

    return (
        <div className="app-container">
            <h1>{bookingId ? "Edit Booking" : "Rent Now"} - Car ID: {carId}</h1>

            <label>
                Start Date:
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
            </label>

            <label>
                End Date:
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </label>

            <button onClick={handleCheckAvailability}>
                {bookingId ? "Check Updated Availability" : "Check Availability"}
            </button>

            {summary && (
                <div className="summary">
                    <h3>Booking Summary</h3>
                    <p>Price: {summary.price}</p>
                    <p>Availability: {summary.available ? "Available" : "Not Available"}</p>
                </div>
            )}

            {summary?.available && (
                <button onClick={handleConfirmBooking}>
                    Confirm Booking
                </button>
            )}
        </div>
    );
}

export default RentNowForm;
