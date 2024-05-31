import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from "../pages/RegisterPage";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import AuthLayouts from "../layout";
import Forgotpassword from "../pages/Forgotpassword";
import HomeScreen from "../Screens/HomeScreen/HomeScreen";
import RegisterScreen from "../Screens/RegisterScreen/RegisterScreen";
import LoginScreen from "../Screens/LoginScreen/LoginScreen";
import UserProfile from "../Screens/UserProfile/UserProfile";
import ProfileScreen from "../Screens/ProfileScreen/ProfileScreen";
import EditProfile from "../Screens/EditProfile/EditProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: (
          <AuthLayouts>
            {/* <RegisterPage /> */}
            <RegisterScreen />
          </AuthLayouts>
        ),
      },
      {
        path: "email",
        element: (
          <AuthLayouts>
            <CheckEmailPage />
          </AuthLayouts>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayouts>
            {/* <CheckPasswordPage /> */}
            <LoginScreen />
          </AuthLayouts>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <AuthLayouts>
            <Forgotpassword />
          </AuthLayouts>
        ),
      },
      {
        path: "",
        element: <HomeScreen />,
      },
      {
        path: "/chat",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
      {
        path: "/user",
        element: <UserProfile />,
        children: [
          {
            path: ":id",
            element: <UserProfile />,
          },
        ],
      },
      {
        path: "/my-profile",
        element: <ProfileScreen />,
        children: [
          {
            path: ":id",
            element: <ProfileScreen />,
          },
        ],
      },
      {
        path: "/edit-profile",
        element: <EditProfile />,
        children: [
          {
            path: ":id",
            element: <EditProfile />,
          },
        ],
      },
    ],
  },
]);

export default router;
