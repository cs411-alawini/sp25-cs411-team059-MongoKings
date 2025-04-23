

"""SELECT cri.Car_Id, cri.City, cri.Vehicle_Type, cri.Daily_Price, AVG(rr.Rating) AS Average_Rating
FROM Booking_Reservations br JOIN Rating_and_Reviews rr ON br.Booking_Id = rr.Booking_id JOIN Car_Rental_Info cri ON br.Car_Id = cri.Car_Id
WHERE cri.State = '%s'
GROUP BY cri.Car_Id
HAVING Average_Rating >= 3
ORDER BY Average_Rating DESC"""
