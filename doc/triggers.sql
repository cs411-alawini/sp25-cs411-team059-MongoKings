
--  If the rental_count is greater than 2, for a particuar car, we increase the daily price by 1%, each time a new booking is made for that car.
-- This is our main trigger
DELIMITER //
Create Trigger increase_price
after INSERT on Booking_Reservations
FOR EACH ROW
BEGIN
    DECLARE rental_count INT;

    SELECT COUNT(*) INTO rental_count
    FROM Booking_Reservations
    WHERE Car_Id = NEW.Car_Id;

    IF rental_count > 2 THEN
        UPDATE Car_Rental_Info
        SET Daily_Price = Daily_Price * 1.01
        WHERE Car_Id = NEW.Car_Id;
    END IF;
END //
DELIMITER ;



DELIMITER //
CREATE TRIGGER increase_number_of_rentals
AFTER INSERT ON Booking_Reservations
FOR EACH ROW
BEGIN
    UPDATE Car_Rental_Info SET Number_of_trips = Number_of_trips + 1
    WHERE Car_Id = NEW.Car_Id;
    UPDATE Customer_Info SET Number_of_Rentals = Number_of_Rentals + 1
    WHERE Customer_Id = NEW.Customer_Id;
END //

DELIMITER ;

-- Here both of our triggers work as we needed 



