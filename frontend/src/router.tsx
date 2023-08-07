import { Navigate, createBrowserRouter, useLocation } from "react-router-dom";
import { useAuth } from "./providers/AuthProvider";
import { Shell } from "./components/Shell";
import { LoginPage } from "./pages/login";
import { NotFoundPage } from "./pages/404";
import { DashboardPage } from "./pages/dashboard";
import { PlaygroundPage } from "./pages/playground";
import { RecipesPage } from "./pages/recipes";
import { SettingsPage } from "./pages/settings";
import { ProfilePage } from "./pages/profile";
import { UsersPage } from "./pages/users";
import { LogsPage } from "./pages/logs";

const Page = ({ component: Component }: { component: React.ComponentType }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate state={{ from: location }} to="/" replace />;
  return (
    <Shell location={location} user={user} onLogout={logout}>
      <Component />
    </Shell>
  );
};

// https://reactrouter.com/en/main/start/overview
export const router = createBrowserRouter([
  { index: true, path: "/", Component: LoginPage },
  { path: "login", Component: LoginPage },
  {
    path: "dashboard",
    element: <Page component={DashboardPage} />,
  },
  {
    path: "playground",
    element: <Page component={PlaygroundPage} />,
  },
  {
    path: "recipes",
    element: <Page component={RecipesPage} />,
  },
  {
    path: "users",
    element: <Page component={UsersPage} />,
  },
  {
    path: "logs",
    element: <Page component={LogsPage} />,
  },
  {
    path: "settings",
    element: <Page component={SettingsPage} />,
  },
  {
    path: "profile",
    element: <Page component={ProfilePage} />,
  },
  { path: "*", Component: NotFoundPage },
]);
