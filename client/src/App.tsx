import "./App.css";
import { AppBar, Button } from "@mui/material";

function App() {
  return (
    <>
      <AppBar>
        <h2>Daniel's kahoot - Home</h2>
      </AppBar>
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
