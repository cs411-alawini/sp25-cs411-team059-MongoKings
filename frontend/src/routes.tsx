import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAppSelector } from "./app/hooks";
import { selectAuthUser } from "./services/Auth/AuthSelectors";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import MainNavbar from "./pages/components/MainNavbar";

const login = "/login";
const dashboard = "/dashboard";
const all = "*";

const links = [
  {
    name: "Dashboard",
    path: dashboard,
  },
];

function AppRouter() {
  const user = useAppSelector(selectAuthUser);
  const loggedIn = user ? true : false;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={login}
          element={!loggedIn ? <Login /> : <Navigate to={dashboard} />}
        />
        <Route
          path={dashboard}
          element={
            loggedIn ? (
              <MainNavbar user={user} links={links} />
            ) : (
              <Navigate to={login} />
            )
          }
        >
          <Route path={dashboard} element={<Dashboard />} />
        </Route>
        <Route path={all} element={<Navigate to={login} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
