import { Outlet } from "react-router-dom";
import MiNavbar from "../NavBar/Navbar";
const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="">
        <MiNavbar />
      </div>
      {/* className="flex flex-grow items-center justify-center px-10 mx-auto" */}
      <div className="flex-grow w-full">
        <Outlet />
      </div>
      {/* <div className="footer-app"></div> */}
    </div>
  );
};

export default Layout;