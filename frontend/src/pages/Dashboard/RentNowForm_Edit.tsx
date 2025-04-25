import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { dashboard } from "../../routes";
import apiEndpoints from "../../data/environment";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../services/Auth/AuthSelectors";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

function RentNowFormEdit() {
    const navigate = useNavigate();
    const { booking_id } = useParams<{ booking_id: string }>();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [summary, setSummary] = useState<any>(null);
    const user = useAppSelector(selectAuthUser);

    if (!booking_id) {
        navigate(dashboard);
        return null;
    }

    const handleCheckAvailability = async () => {
        try {
            if (user === null) {
                alert("Please log in to check availability.");
                return;
            }
            console.log("Booking ID:", booking_id)
            const response = await fetch(apiEndpoints.edit_booking, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    booking_id: parseInt(booking_id),
                    start_date: startDate,
                    end_date: endDate,
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
        const response = await fetch(apiEndpoints.edit_booking_confirm, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                booking_id: parseInt(booking_id),
                start_date: startDate,
                end_date: endDate,
            })
        });

        if (response.ok) {
            alert("Booking modified!");
            navigate(dashboard);
        } else {
            const error = await response.json();
            alert(error.message || "Booking could not be modified.");
        }
    };

    return (
        <Container className="mt-4">
            <h1 className="mb-4"> Modify Booking: {booking_id}</h1>

            <Form>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="endDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button type="button" variant="primary" onClick={handleCheckAvailability}>
                    Check Availability & Price
                </Button>
            </Form>

            {summary && (
                <Card className="mt-4">
                    <Card.Body>
                        <Card.Title>Summary</Card.Title>
                        <Card.Text>Customer: {summary.customer_name}</Card.Text>
                        <Card.Text>Total Payment: ${summary.total_payment}</Card.Text>
                        <Card.Text>Insurance: ${summary.insurance_val}</Card.Text>
                        {summary.discount_price && (
                            <Card.Text>Discounted Daily Rate: ${summary.discount_price}</Card.Text>
                        )}
                        <Button variant="success" onClick={handleConfirmBooking}>
                            Confirm Booking
                        </Button>
                    </Card.Body>
                </Card>
            )}

            <Button variant="secondary" className="mt-3" onClick={() => navigate(dashboard)}>
                Back to Dashboard
            </Button>
        </Container>
    );
}

export default RentNowFormEdit;