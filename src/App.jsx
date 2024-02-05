import { BrowserRouter, useRoutes } from "react-router-dom";
import "./App.css";
import SignUpForm from "./components/Signup";
import { UserAuthContextProvider } from "./context/userContext";
import LoginForm from "./components/Signin";
import ProtectedLayout from "./Layouts/ProtectedLayout";
import AuthLayout from "./Layouts/AuthLayout";
import Home from "./Pages/Home";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserAuthContextProvider>
          <Router />
        </UserAuthContextProvider>
      </BrowserRouter>
    </>
  );
}

function Router() {
  let element = useRoutes([
    {
      element: <AuthLayout />,
      children: [
        {
          path: "/signup",
          element: <SignUpForm />,
        },
        { path: "/login", element: <LoginForm /> },
      ],
    },
    {
      path: "/",
      element: <ProtectedLayout />,
      children: [{ path: "/", element: <Home /> }],
    },
  ]);

  return element;
}

export default App;
