import { Link } from "react-router-dom";

import ModalLauncher from "./modals/ModalLauncher";
import UseModal from "./modals/UseModal";

function Navbar({ isAuth, logout, setAdmin, setAuth }) {
  const { isShowingModal, toggleModal } = UseModal();

  return (
    <>
      <header id="main_header" className="header">
        <div className="header_inner">
          <nav>
            <Link to={"/personnel"} className="lcars_btn purple_btn left_round header_btn">
              Personnel
            </Link>
            <Link to={"/starships"} className="lcars_btn purple_btn all_sqaure header_btn">
              Starships
            </Link>
            {isAuth ? (
              <Link
                to={"/"}
                onClick={logout}
                className="lcars_btn purple_btn right_round header_btn"
              >
                Logout
              </Link>
            ) : (
              <button onClick={toggleModal} className="lcars_btn purple_btn right_round header_btn">
                Login
              </button>
            )}
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
