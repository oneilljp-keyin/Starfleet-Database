import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Landing({ isAuth, setAuth, admin, setAdmin, userName, setName }) {
  const logout = (e) => {
    e.preventDefault();
    try {
      localStorage.removeItem("token");
      setAuth(false);
      toast.success("Logout Successful");
      setAdmin(false);
      setName("");
    } catch (err) {
      toast.success(err.message);
      console.log(err.message);
    }
  };

  return (
    <>
      <article>
        <header>
          <h3 className="text-center">Welcome to Sector 709</h3>
          <h3 className="text-center">{userName}</h3>
          <h3 className="text-center">{admin && "[You have Administrator priveleges]"}</h3>
        </header>
        <div className="article-content">
          <h1 className="text-center">
            The search features are auto-complete, as you type, the results will come up{" "}
          </h1>
          <h4 className="text-center">
            This site is just launched, so the information is limited, I have a list of personnel
            and starships, but information on each is almost non-existent. Might implement a update
            feature, let you know when the site gets updated.{" "}
          </h4>

          <ul>
            <li>In the Personnel section, results will appear as you type.</li>
            <li>
              In the Starship section, you can search by name or class, if the name is empty
              <br />
              select a class to bring up starships of that class, where you can narrow them down
              <br />
              by name if you wish.
            </li>
          </ul>
          <h2 style={{ textTransform: "none" }}>
            Information on this site has been gathered mainly from{" "}
            <a href="http://memory-alpha.fandom.com" target="_blank" rel="noreferrer">
              Memory Alpha
            </a>
            . If you want more detailed information, a visit there is recommended. I will eventually
            include direct links for easier access.
          </h2>
        </div>
        <footer className="justify-content-between">
          <a href="http://johnoneill.tech" target="_blank" rel="noreferrer">
            johnoneill.tech
          </a>
          {isAuth ? (
            <Link to={"/"} onClick={logout}>
              logout
            </Link>
          ) : (
            <Link to={"/signin"}>admin</Link>
          )}
          <div className="footer-bar"></div>
        </footer>
      </article>
    </>
  );
}

export default Landing;
