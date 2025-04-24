DELIMITER //

CREATE TRIGGER increase_price
AFTER INSERT ON Purchases
FOR EACH ROW
BEGIN
    DECLARE rental_count INT;

    -- Get current number of rentals for this car
    SELECT Number_of_Rentals INTO rental_count
    FROM Car_Rental_Info
    WHERE Car_Id = NEW.Car_Id;

    -- Increase price if rentals exceed 10
    IF rental_count > 10 THEN
        UPDATE Car_Rental_Info
        SET Daily_Price = Daily_Price * 1.01
        WHERE Car_Id = NEW.Car_Id;
    END IF;
END //

DELIMITER;
