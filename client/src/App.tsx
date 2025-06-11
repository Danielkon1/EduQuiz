import "./App.css";
import { AppBar, Button } from "@mui/material";

function App() {
  return (
    <>
      <AppBar>
        <h2>EduQuiz - Home</h2>
      </AppBar>
      <h2>Welcome to EduQuiz</h2>
      <h2>Select Option</h2>
      <Button variant="outlined" className="outlinedButtons">
        <a href="/signup">Sign up / Log in</a>
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
