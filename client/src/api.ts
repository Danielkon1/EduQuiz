// somewhere in your React app
fetch("http://localhost:8080/add_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "daniel",
      password: "securepassword123"
    }),
  })
    .then(response => response.text())
    .then(data => {
      console.log("Server responded:", data);
    })
    .catch(error => {
      console.error("Error sending request:", error);
    });
  