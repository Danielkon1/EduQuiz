import "./App.css";
import { AppBar, Button } from "@mui/material";

function App() {
  return (
    <>
      <AppBar>
        <div className="appBarContent">
          <img src="/MainLogo.png" className="mainLogo" />
          <h2 className="centerText">Home</h2>
        </div>
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
