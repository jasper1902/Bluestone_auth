import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RegisterForm from "./pages/RegisterForm"
import LoginForm from "./pages/LoginForm";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";

function App() {
  const router = createBrowserRouter([
    {
      path: "/register",
      element: <RegisterForm />,
    },
    {
      path: "/login",
      element: <LoginForm />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
