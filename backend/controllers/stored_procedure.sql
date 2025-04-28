-- Here, have created a stored procedure to integrate and work with the search results which depdend on the ratings of the cars and only show the cars that have not been booked for the next 30 days.

CREATE VIEW car_ratings_view_final AS
SELECT
    cri.Car_Id,
    cri.Daily_Price,
    cri.Fuel_Type,
    cri.City,
    cri.State,
    cri.Vehicle_Type,
    cri.Vehicle_Make,
    cri.Vehicle_model,
    AVG(rr.Rating) AS Average_Rating
FROM 
    Car_Rental_Info cri 
LEFT JOIN 
    Booking_Reservations br ON cri.Car_Id = br.Car_Id 
LEFT JOIN 
    Rating_and_Reviews rr ON br.Booking_Id = rr.Booking_Id
GROUP BY 
    cri.Car_Id, cri.Daily_Price, cri.Fuel_Type, cri.City, cri.State, cri.Vehicle_Type
HAVING 
    AVG(rr.Rating) >= 3;


CREATE VIEW state_availability_view_final AS 
SELECT 
    distinct c.car_id,
    c.state,
    c.Daily_Price,
    c.Fuel_Type,
    c.Vehicle_Type,
    c.Vehicle_Make,
    c.Vehicle_model,
    c.City
    FROM
    Car_Rental_Info c
    LEFT JOIN Booking_Reservations b 
    ON c.car_id = b.car_id
WHERE 
    c.car_id NOT IN (
        SELECT car_id 
        FROM Booking_Reservations b 
        WHERE b.end_date >= CURDATE() 
        AND b.start_date <= CURDATE() + INTERVAL 30 DAY
    )
    GROUP BY Car_Id

DROP PROCEDURE IF EXISTS SearchCarsWithRating_final_check;
DELIMITER //

CREATE PROCEDURE SearchCarsWithRating_final_check(
    IN p_search_term VARCHAR(255)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE state_val VARCHAR(255);
    DECLARE car_id_val VARCHAR(255);
    DECLARE daily_price_val DECIMAL(10);
    DECLARE fuel_type_val VARCHAR(50);
    DECLARE avg_rating_val DECIMAL(10);
    DECLARE rating_description_val VARCHAR(255);

    DECLARE car_cursor CURSOR FOR
        SELECT 
            s.State,
            s.Car_Id,
            s.Daily_Price,
            s.Fuel_Type,
            IFNULL(r.Average_Rating, 1.5) AS Average_Rating
        FROM 
            state_availability_view_final s 
        LEFT JOIN 
            car_ratings_view_final r ON r.car_id = s.car_id
        WHERE 
            SOUNDEX(s.City) = SOUNDEX(p_search_term)
            OR SOUNDEX(s.State) = SOUNDEX(p_search_term)
            OR SOUNDEX(s.Vehicle_Type) = SOUNDEX(p_search_term)
            OR SOUNDEX(s.Car_Id) = SOUNDEX(p_search_term)
            OR SOUNDEX(s.Vehicle_Make) = SOUNDEX(p_search_term)
            OR SOUNDEX(s.Vehicle_model) = SOUNDEX(p_search_term)
            OR SOUNDEX(s.Fuel_Type) = SOUNDEX(p_search_term)
        ORDER BY Average_Rating DESC, Daily_Price;


    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;


    CREATE TABLE IF NOT EXISTS final_results (
        State_name VARCHAR(255),
        Car_Id VARCHAR(255),
        Daily_Price DECIMAL(10),
        Fuel_Type VARCHAR(255),
        Average_Rating DECIMAL(10),
        Rating_Description VARCHAR(255)
    );

    OPEN car_cursor;

    read_loop: LOOP
        FETCH car_cursor INTO  state_val, car_id_val, daily_price_val, fuel_type_val, avg_rating_val;
        IF done THEN
            LEAVE read_loop;
        END IF;

        IF avg_rating_val > 5 THEN
            SET rating_description_val = 'Perfect';
        ELSEIF avg_rating_val > 3 THEN
            SET rating_description_val = 'Good';
        ELSE
            SET rating_description_val = 'Not suited';
        END IF;

        INSERT INTO final_results 
            (State_name, Car_Id, Daily_Price, Fuel_Type, Average_Rating, Rating_Description)
        VALUES 
            (state_val, car_id_val, daily_price_val, fuel_type_val, avg_rating_val, rating_description_val);
    END LOOP;

    CLOSE car_cursor;


    SELECT * FROM final_results ORDER BY Average_Rating DESC, Daily_Price;
    DROP TABLE IF EXISTS final_results;
END //

DELIMITER ;
