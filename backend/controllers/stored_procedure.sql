CREATE VIEW car_ratings_view_sss AS
SELECT
    cri.Car_Id,
    cri.Daily_Price,
    cri.Fuel_Type,
    cri.City,
    cri.State,
    cri.Vehicle_Type,
    AVG(rr.Rating) AS Average_Rating,
    IF(AVG(rr.Rating) >= 5, 'perfect',
        IF(AVG(rr.Rating) >= 4, 'good',
            IF(AVG(rr.Rating) >= 3, 'okay', NULL)
        )
    ) AS Rating_Category
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




CREATE VIEW state_availability_view_sss AS 
SELECT 
    c.car_id,
    c.state
    FROM
    Car_Rental_Info c 
WHERE 
    c.car_id NOT IN (
        SELECT car_id 
        FROM Booking_Reservations b 
        WHERE b.end_date >= CURDATE() 
          AND b.start_date <= CURDATE() + INTERVAL 30 DAY
    )
GROUP BY c.state, c.car_id;



DELIMITER //

CREATE PROCEDURE SearchCarsWithRating(
    IN p_search_term VARCHAR(255),
)
BEGIN

    SELECT 
        r.Car_Id,
        r.Daily_Price,
        r.Fuel_Type,
        r.Rating_Category
    FROM 
        car_ratings_view_sss r
    JOIN 
        state_availability_view_sss s ON r.car_id = s.car_id
    -- WHERE 
    --     -- SOUNDEX(City) = SOUNDEX(p_search_term)
    --     -- OR SOUNDEX(State) = SOUNDEX(p_search_term)
    --     -- OR SOUNDEX(Vehicle_Type) = SOUNDEX(p_search_term)
    --     -- OR SOUNDEX(Fuel_Type) = SOUNDEX(p_search_term)
    ORDER BY 
        r.Daily_Price;
END //
DELIMITER;