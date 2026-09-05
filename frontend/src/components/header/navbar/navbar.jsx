import BottomNavbar from "./bottom/bottomNavbar";
import CenterNavbar from "./center/centerNavbar";
import LeftNavbar from "./left/leftNavbar";
import RightNavbar from "./right/rightNavbar";
import "./navbar.css";

function Navbar() {
    return(
        <nav id="navbar">
            <div className="navbarContTop">
                <LeftNavbar />
                <CenterNavbar />
                <RightNavbar />
            </div>
            <div className="navbarContBottom">
                <BottomNavbar />
            </div>
        </nav>
    );
};

export default Navbar;