import { Outlet } from "react-router-dom";
import Nav from "./nav-component";

const Layout = ({ currentUser, setCurrentUser, setSearchName }) => {
  return (
    <>
      <Nav
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setSearchName={setSearchName}
      />
      <Outlet />
    </>
  );
};

export default Layout;
