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
        element: <RegisterScreen />,
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
        element: <LoginScreen />,
      },
      {
        path: "forgot-password",
        element: <Forgotpassword />,
      },
      {
        path: "",
        element: (
          <AuthLayouts>
            <HomeScreen />
          </AuthLayouts>
        ),
      },
      {
        path: "/chat",
        element: (
          <AuthLayouts>
            <Home />
          </AuthLayouts>
        ),
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
      {
        path: "/user",
        element: (
          <AuthLayouts>
            <UserProfile />
          </AuthLayouts>
        ),
        children: [
          {
            path: ":id",
            element: (
              <AuthLayouts>
                {" "}
                <UserProfile />
              </AuthLayouts>
            ),
          },
        ],
      },
      {
        path: "/my-profile",
        element: (
          <AuthLayouts>
            <ProfileScreen />
          </AuthLayouts>
        ),
        children: [
          {
            path: ":id",
            element: (
              <AuthLayouts>
                {" "}
                <ProfileScreen />
              </AuthLayouts>
            ),
          },
        ],
      },
      {
        path: "/edit-profile",
        element: (
          <AuthLayouts>
            <EditProfile />
          </AuthLayouts>
        ),
        children: [
          {
            path: ":id",
            element: (
              <AuthLayouts>
                {" "}
                <EditProfile />
              </AuthLayouts>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
