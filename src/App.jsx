import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Router } from "./routes";

const router = createBrowserRouter(Router);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
