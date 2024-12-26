import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.tsx";
import User from "./pages/User.tsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/user',
    element: <User />
  }
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
