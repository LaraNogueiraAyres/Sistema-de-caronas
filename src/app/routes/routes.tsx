import { createBrowserRouter } from "react-router";
import { Onboarding } from "../../pages/Onboarding";
import { LoginPage } from "../../pages/LoginPage";
import { Layout } from "../../layout/layout";
import { HomePage } from "../../pages/HomePage";
import { FindRide } from "../../pages/FindRidePage";
import { Profile } from "../../pages/ProfilePage";
import { OfferRide } from "../../pages/OfferRidePage";
import { MyRides } from "../../pages/MyRidesPage";
import { History } from "../../pages/HistoryPage";
// import { ConstructionPage } from "../../pages/ConstructionPage";
import { PublicProfile } from "../../pages/PublicProfilePage";
import { Settings } from "../../pages/SettingsPage";
import { ForgotPassword } from "../../pages/ForgotPasswordPage";
import { RatingsPage } from "../../pages/RatingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Onboarding,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
        path: "/forgot-password",
        Component: ForgotPassword,
      },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        path: "/home",
        Component: HomePage,
      },
      {
        path: "/find-ride",
        Component: FindRide,
      },
      {
        path: "/profile",
        Component: Profile,
      },
      {
        path: "/offer-ride",
        Component: OfferRide,
      },
      {
        path: "/my-rides",
        Component: MyRides,
      },
      {
        path: "/history",
        Component: History,
      },
       {
        path: "/user/:userId",
        Component: PublicProfile,
      },
      {
        path: "/user/:userId/ratings",
        Component: RatingsPage,
      },
      {
        path: "/profile/ratings",
        Component: RatingsPage,
      },
      {
        path: "/settings",
        Component: Settings,
      },
      
    ],
  },
]);