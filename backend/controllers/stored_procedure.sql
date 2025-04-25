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
    DECLARE v_state VARCHAR(255);
    DECLARE v_car_id VARCHAR(255);
    DECLARE v_daily_price DECIMAL(10);
    DECLARE v_fuel_type VARCHAR(50);
    DECLARE v_avg_rating DECIMAL(10);
    DECLARE v_rating_description VARCHAR(255);

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
        FETCH car_cursor INTO  v_state, v_car_id, v_daily_price, v_fuel_type, v_avg_rating;
        IF done THEN
            LEAVE read_loop;
        END IF;

        IF v_avg_rating > 5 THEN
            SET v_rating_description = 'Perfect';
        ELSEIF v_avg_rating > 3 OR Daily_Price > 40 THEN
            SET v_rating_description = 'Good';
        ELSE
            SET v_rating_description = 'Not suited';
        END IF;

        INSERT INTO final_results 
            (State_name, Car_Id, Daily_Price, Fuel_Type, Average_Rating, Rating_Description)
        VALUES 
            (v_state, v_car_id, v_daily_price, v_fuel_type, v_avg_rating, v_rating_description);
    END LOOP;

    CLOSE car_cursor;


    SELECT * FROM final_results ORDER BY Average_Rating DESC, Daily_Price;
    DROP TABLE IF EXISTS final_results;
END //

DELIMITER ;
