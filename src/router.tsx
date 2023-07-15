import { createBrowserRouter } from "react-router-dom";
import { IndexPage } from "./pages";

// https://reactrouter.com/en/main/start/overview
export const router = createBrowserRouter([
  {
    path: "/",
    Component: IndexPage,
  },
  {
    path: "test",
    element: <div>test</div>,
  },
]);
