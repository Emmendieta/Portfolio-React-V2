/* import Footer from "./components/footer/Footer"; */
import GlobalLoader from "./hooks/GlobalLoader.hook";
import { Outlet } from "react-router-dom";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import ScrollToTop from "./components/general/scrollTop";
import "./Layout.css";

function Layout() {
    return (
        <div id="layoutDiv">
            <ScrollToTop />
            <header id="header">
                <Header />
            </header>
            <GlobalLoader />
            <main id="body">
                <Outlet /> {/* Aquí se va a renderizar el contenido del Body según la ruta */}
            </main>
            <footer id="footer">
                <Footer />
            </footer>
        </div>
    );
};

export default Layout;