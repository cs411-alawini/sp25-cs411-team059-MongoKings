import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Form, Button, Row, Col } from 'react-bootstrap';
import apiEndpoints from '../../data/environment';
import { dashboard } from '../../routes';

const ReviewForm: React.FC = () => {
    const navigate = useNavigate();
    const [rating, setRating] = useState<number>(5);
    const [review, setReview] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const { booking_id } = useParams<{ booking_id: string }>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!review.trim()) {
            alert('Please add a review comment');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(apiEndpoints.add_review, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    booking_id: parseInt(booking_id || '0'),
                    rating: rating,
                    review: review
                })
            });

            if (response.ok) {
                alert("Review submitted!");
                navigate(dashboard);
            } else {
                const error = await response.json();
                alert(error.message || "Submission failed.");
            }

            setRating(5);
            setReview('');
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="mt-5">
            <Card className="shadow-sm">
                <Card.Body>
                    <Card.Title className="mb-4">Add Your Review</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Rating</Form.Label>
                            <Row>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Col key={star} xs="auto">
                                        <Button
                                            variant="link"
                                            onClick={() => setRating(star)}
                                            className={`p-0 ${star <= rating ? 'text-warning' : 'text-secondary'}`}
                                            style={{ fontSize: '1.5rem' }}
                                        >
                                            ★
                                        </Button>
                                    </Col>
                                ))}
                                <Col className="align-self-center text-muted">{rating} out of 5</Col>
                            </Row>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="review">
                            <Form.Label>Your Review</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Share your experience..."
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                            className="w-100"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ReviewForm;
