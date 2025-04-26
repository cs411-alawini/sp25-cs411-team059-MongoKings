import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { dashboard } from "../../routes";
import apiEndpoints from "../../data/environment";
import { useAppSelector } from "../../app/hooks";
import { selectAuthUser } from "../../services/Auth/AuthSelectors";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Review from "../../types/Review/Review";
import Car from "../../types/Car/Car";

function RentNowForm() {
    const navigate = useNavigate();
    const { carId } = useParams<{ carId: string }>();
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [summary, setSummary] = useState<any>(null);
    const user = useAppSelector(selectAuthUser);
    const [carReviews,     setCarReviews]    = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [reviewsError,   setReviewsError]   = useState<string | null>(null);
    const [carDetails, setCarDetails] = useState<Car | null>(null);

    useEffect(() => {
        // Fetch car details
        fetch(`${apiEndpoints.car}/${carId}`)
          .then(response => response.json())
          .then(data => {
            setCarDetails(data);
          })
          .catch(error => {
            console.error("Error fetching car details:", error);
          });
        
        setReviewsLoading(true);
        fetch(`${apiEndpoints.reviewsByCar}?car_id=${carId}`)
          .then(async res => {
            if (res.status === 404) {
              // no reviews yet
              setCarReviews([]);
              return null;
            }
            if (!res.ok) {
              throw new Error(res.statusText);
            }
            return res.json();
          })
          .then(data => {
            if (data?.reviews) setCarReviews(data.reviews);
          })
          .catch(() => {
            // only show on real errors
            setReviewsError("Failed to load reviews");
          })
         .finally(() => setReviewsLoading(false));
    }, [carId]);

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
        <Container className="mt-4">
            <h1 className="mb-4">Rent Now - Car ID: {carId}</h1>
    
            {carDetails && (
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>{carDetails.Vehicle_Make} {carDetails.Vehicle_Model}</Card.Title>
                        <Card.Text>Daily Price: ${carDetails.Daily_Price}</Card.Text>
                        <Card.Text>Previous Trips: {carDetails.Number_of_trips || 0}</Card.Text>
                    </Card.Body>
                </Card>
            )}
    
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
    
                <Button variant="primary" onClick={handleCheckAvailability}>
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

            <h4 className="mt-4">Customer Reviews</h4>

            {reviewsLoading && <p>Loading reviews…</p>}
            {reviewsError   && <p className="text-danger">Error: {reviewsError}</p>}

            {(!reviewsLoading && !reviewsError && carReviews.length === 0) && (
              <p>No reviews for this car yet.</p>
            )}

            {carReviews.map(r => (
              <Card key={r.booking_id} className="mb-3">
                <Card.Body>
                  <Card.Title>{r.rating} / 5 stars</Card.Title>
                  <Card.Text>{r.review_text}</Card.Text>
                  <Card.Subtitle className="text-muted">
                    {new Date(r.published_date).toLocaleDateString()}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            ))}
    
            <Button variant="secondary" className="mt-3" onClick={() => navigate(dashboard)}>
                Back to Dashboard
            </Button>
        </Container>
    );}

export default RentNowForm;
