import { createBrowserRouter } from "react-router";
import { Onboarding } from "../../pages/Onboarding";
// import { Login } from "./components/login";
import { Layout } from "../../layout/layout";
import { HomePage } from "../../pages/HomePage";
import { LoginPage } from "../../pages/LoginPage";
// import { Home } from "./components/home";
// import { FindRide } from "./components/find-ride";
// import { Profile } from "./components/profile";
// import { OfferRide } from "./components/offer-ride";
// import { MyRides } from "./components/my-rides";
// import { History } from "./components/history";

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
    path: "/",
    Component: Layout,
    children: [
      {
        path: "/home",
        Component: Onboarding,
      },
      {
        path: "/home",
        Component: HomePage,
      },
    //   {
    //     path: "/find-ride",
    //     Component: FindRide,
    //   },
    //   {
    //     path: "/profile",
    //     Component: Profile,
    //   },
    //   {
    //     path: "/offer-ride",
    //     Component: OfferRide,
    //   },
    //   {
    //     path: "/my-rides",
    //     Component: MyRides,
    //   },
    //   {
    //     path: "/history",
    //     Component: History,
    //   },
    ],
  },
]);