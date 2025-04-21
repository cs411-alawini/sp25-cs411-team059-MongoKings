import { Button, Container, Nav, Navbar, NavbarBrand } from "react-bootstrap";
import { useAppDispatch } from "../../app/hooks";
import User from "../../types/Authentication/User";
import { logout } from "../../services/Auth/AuthSlice";
import React, { useEffect } from "react";
import { Outlet } from "react-router";
import { getCars } from "../../services/Car/CarSlice";

interface MainNavbarProps {
  user: User | null;
  links: { name: string; path: string }[];
}

function MainNavbar({ user, links }: MainNavbarProps): JSX.Element {
  const dispatch = useAppDispatch();
  const handleLogoutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    dispatch(logout());
  };

  useEffect(() => {
    dispatch(getCars());
  }, [dispatch]);

  return (
    <div>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>Car rental application</Navbar.Brand>
          <Nav className="me-auto">
            {links.map((link) => (
              <Nav.Link key={link.path} href={link.path}>
                {link.name}
              </Nav.Link>
            ))}
          </Nav>
          {user && (
            <div>
              <NavbarBrand>{user.name}</NavbarBrand>
              <Button onClick={handleLogoutClick}>Logout</Button>
            </div>
          )}
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default MainNavbar;
