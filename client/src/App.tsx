import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RegisterForm from "./pages/RegisterForm"
import LoginForm from "./pages/LoginForm";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";

import { FaGithubSquare } from "react-icons/fa";

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
      path: "/",
      element: <Profile />,
    },
    {
      path: "/forgotpassword",
      element: <ForgotPassword />,
    },
  ]);

  return (
    <>
      <div className="container mx-auto">
        <div className="relative left-0 top-0 p-4"><a href="https://github.com/jasper1902/Bluestone_auth"><FaGithubSquare size={30} /></a></div>
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App
