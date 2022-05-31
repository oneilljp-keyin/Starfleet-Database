import { Link } from "react-router-dom";

import ModalLauncher from "./modals/ModalLauncher";
import UseModal from "./modals/UseModal";

import { LCARSCode, RandomButtonColour, buttonStack } from "./hooks/HooksAndFunctions";

function Navbar({ isAuth, logout, setAdmin, setAuth }) {
  const { isShowingModal, toggleModal } = UseModal();
  const headerButtonClass = "lcars-btn header_btn events-btn";

  return (
    <>
      <header id="main_header" className="header">
        <div className="header_inner">
          <nav className="flex-row d-flex">
            {/* <div className="lcars_end_cap left_round purple_btn"> </div> */}
            <Link
              to={"/personnel"}
              className={`${headerButtonClass} left_round ` + RandomButtonColour()}
            >
              {buttonStack("Personnel", 2, 4)}
            </Link>
            <Link
              to={"/starships"}
              className={`${headerButtonClass} all_square ` + RandomButtonColour()}
            >
              {buttonStack("Starships", 2, 4)}
            </Link>
            {isAuth ? (
              <Link
                to={"/"}
                onClick={logout}
                className={`${headerButtonClass} right_round ` + RandomButtonColour()}
              >
                {buttonStack("Logout", 2, 4)}
              </Link>
            ) : (
              <button onClick={toggleModal} className={`${headerButtonClass} right_round pink_btn`}>
                {buttonStack("Login", 2, 4)}
              </button>
            )}
            {/* <div className="lcars_end_cap right_round purple_btn"> </div> */}
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
