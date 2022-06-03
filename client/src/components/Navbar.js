import { Link } from "react-router-dom";

import ModalLauncher from "./modals/ModalLauncher";
import UseModal from "./modals/UseModal";

import { buttonStack } from "./hooks/HooksAndFunctions";

function Navbar({ isAuth, logout, setAdmin, setAuth }) {
  const { isShowingModal, toggleModal } = UseModal();
  const headerButtonClass = "lcars-btn header-btn events-btn";

  return (
    <>
      <header id="main-header" className="header">
        <div className="header-inner">
          <nav className="flex-row d-flex">
            {/* <div className="lcars-end-cap left-round purple-btn"> </div> */}
            <Link to={"/personnel"} className={`${headerButtonClass} left-round blue-btn`}>
              {buttonStack("Personnel", 2, 4)}
            </Link>
            <Link to={"/starships"} className={`${headerButtonClass} all-square orange-btn`}>
              {buttonStack("Starships", 2, 4)}
            </Link>
            {isAuth ? (
              <Link
                to={"/"}
                onClick={logout}
                className={`${headerButtonClass} right-round red-btn`}
              >
                {buttonStack("Logout", 2, 4)}
              </Link>
            ) : (
              <button onClick={toggleModal} className={`${headerButtonClass} right-round pink-btn`}>
                {buttonStack("Login", 2, 4)}
              </button>
            )}
            {/* <div className="lcars-end-cap right-round purple-btn"> </div> */}
          </nav>
        </div>
      </header>
      <ModalLauncher
        modal={"signin"}
        isShowing={isShowingModal}
        hide={toggleModal}
        setAdmin={setAdmin}
        setAuth={setAuth}
      />
    </>
  );
}

export default Navbar;
