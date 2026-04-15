import { createBrowserRouter } from "react-router";
// import { Onboarding } from "./components/onboarding";
// import { Login } from "./components/login";
import { Layout } from "../../layout/layout";
import { HomePage } from "../../pages/HomePage";
// import { Home } from "./components/home";
// import { FindRide } from "./components/find-ride";
// import { Profile } from "./components/profile";
// import { OfferRide } from "./components/offer-ride";
// import { MyRides } from "./components/my-rides";
// import { History } from "./components/history";
import { ConstructionPage } from "../../pages/ConstructionPage";

export const router = createBrowserRouter([
//   {
//     path: "/",
//     Component: Onboarding,
//   },
//   {
//     path: "/login",
//     Component: Login,
//   },
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
        Component: ConstructionPage,
      },
      {
        path: "/profile",
        Component: ConstructionPage,
      },
      {
        path: "/offer-ride",
        Component: ConstructionPage,
      },
      {
        path: "/my-rides",
        Component: ConstructionPage,
      },
      {
        path: "/history",
        Component: ConstructionPage,
      },
    ],
  },
]);