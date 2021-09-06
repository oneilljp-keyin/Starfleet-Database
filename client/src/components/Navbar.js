import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

function Navbar({ user, isAuth, setAuth, setAdmin, setName, setTime }) {
  const history = useHistory();
  // const [btnText, setBtnText] = useState("menu");
  const [isStarshipSearchActive, setIsStarshipSearchActive] = useState(false);
  const [isPersonnelSearchActive, setIsPersonnelSearchActive] = useState(false);
  const [refreshClock, setRefreshClock] = useState(false);

  const logout = (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout Succesful");
      setAdmin(false);
      setName("");
      history.push("/");
    } catch (err) {
      console.log(err.message);
    }
  };

  // useEffect(() => {
  //   const d = new Date();
  //   const hour = d.getHours();
  //   const minutes = d.getMinutes();

  //   if (hour < 10 && minutes >= 10) {
  //     setTime("0" + hour.toString() + ":" + minutes.toString());
  //   } else if (hour >= 10 && minutes < 10) {
  //     setTime(hour.toString() + ":0" + minutes.toString());
  //   } else if (hour < 10 && minutes < 10) {
  //     setTime("0" + hour.toString() + ":0" + minutes.toString());
  //   } else {
  //     setTime(hour.toString() + ":" + minutes.toString());
  //   }
  //   setRefreshClock(false);
  // }, [refreshClock, setTime]);

  // setInterval(() => {
  //   setRefreshClock(true);
  // }, 60000);

  // const toggleNav = () => {
  //   setIsActive(!isActive);
  //   if (btnText === "menu") {
  //     setBtnText("close");
  //   } else {
  //     setBtnText("menu");
  //   }
  // };

  const toggleStarshipSearch = () => {
    setIsStarshipSearchActive(!isStarshipSearchActive);
  };

  const togglePersonnelSearch = () => {
    setIsPersonnelSearchActive(!isPersonnelSearchActive);
  };

  return (
    <>
      <header id="main_header" className="header">
        <div className="header_inner">
          {/* <hgroup className="p-2">
            <Link to={"/"} className="navbar-brand">
              <h2 className="text-right">Starfleet Database at Sector 709</h2>
            </Link>
          </hgroup> */}

          {/* <div className="menu-btn_wrapper">
            <button id="menu-btn" className="material-icons" onClick={toggleNav}>
              {btnText}
            </button>
          </div> */}

          {/* <nav id="main_nav" className={isActive ? "active" : null}> */}
          <nav id="main_nav" className="active">
            <ul>
              <li>
                <span onClick={togglePersonnelSearch}>
                  {" "}
                  <Link to={"/personnel"} className="nav-link">
                    Personnel
                  </Link>
                </span>
              </li>
              <li>
                <span onClick={toggleStarshipSearch}>
                  {" "}
                  <Link to={"/starships"} className="nav-link">
                    Starships
                  </Link>
                </span>
              </li>
              <li>
                <span>
                  {isAuth ? (
                    <Link
                      to={"/"}
                      onClick={logout}
                      className="nav-link"
                      style={{ cursor: "pointer" }}
                    >
                      Logout
                    </Link>
                  ) : (
                    <Link to={"/signin"} className="nav-link">
                      Sign In
                    </Link>
                  )}
                </span>
              </li>
              {/* {!isAuth ? (
                <li className="nav-item">
                  <Link to={"/signup"} className="nav-link">
                    Sign Up
                  </Link>
                </li>
              ) : (
                " "
              )} */}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Navbar;
