import { Button, TextField } from "@mui/material";
import "./design.css";
import { useState } from "react";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage("Error connecting to the server.");
    }
  };

  return (
    <>
      <p>enter fields</p>

      <TextField
        label="username"
        variant="outlined"
        className="custom-text-field"
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <br />
      <TextField
        label="password"
        variant="outlined"
        className="custom-text-field"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>

      <Button variant="contained">Sign In</Button>
    </>
  );
}

export default SignUp;
