import "./App.css";
import { Button } from "@mui/material";

function App() {
  return (
    <>
      <h2>Welcome to Daniel's kahoot</h2>
      <p>Select Option</p>
      <Button variant="outlined" className="outlinedButtons">
        <a href="/signup">Sign up</a>
      </Button>
      <br />
      <br />
      <Button variant="outlined" className="outlinedButtons">
        <a href="/game">Enter Existing Game</a>
      </Button>
    </>
  );
}

export default App;
