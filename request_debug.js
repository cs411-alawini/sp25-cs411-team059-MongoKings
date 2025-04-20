const response = fetch("http://127.0.0.1:5000/login", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        "username": 101498,
        "password": 3537386979    
    })
})
.then(response => {
    if (!response.ok) {
      // Log some extra details
      console.error(`Error Status: ${response.status}`);
      console.error(`Status Text: ${response.statusText}`);

      // Try to read the error message from the response body (if any)
      return response.text().then(errorBody => {
        throw new Error(`Server error (${response.status}): ${errorBody}`);
      });
    }
    return response.json();
  })
  .then(data => {
    console.log('Data received:', data);
  })
  .catch(error => {
    console.error('Fetch error:', error.message);
  });
