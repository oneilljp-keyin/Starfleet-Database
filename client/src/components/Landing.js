import { Link } from "react-router-dom";

function Login({ setAuth, userId, getProfile, userName }) {
  // // const [history, setHistory] = useState({});

  // const searchHistory = async (userId) => {
  //   try {
  //     const response = await fetch(`http://localhost:8000/api/v1/personnel/history/${userId}`, {
  //       method: "GET",
  //       headers: { token: localStorage.token },
  //     });

  //     const parseData = await response.json();
  //   } catch (err) {
  //     console.error(err.message);
  //   }

  //   // PersonnelDataService.searchHistory(id)
  //   //   .then((response) => {
  //   //     console.log(response.data);
  //   //     setHistory(response.data.history);
  //   //   })
  //   //   .catch((e) => {
  //   //     console.log(e);
  //   //   });
  // };

  // useEffect(() => {
  //   searchHistory(userId);
  // }, [userId]);

  return (
    <>
      <article>
        <header>
          <h3 className="text-center">
            Welcome to Sector 709{userName && ","} {userName}
          </h3>
        </header>
        <div className="article_content">
          <p>The search features are auto-complete, as you type, the results will come up </p>
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
        </div>
        <footer className="justify-content-between">
          <a href="http://johnoneill.tech" target="_blank" rel="noreferrer">
            johnoneill.tech
          </a>
          <Link to={"/signin"}>admin</Link>
          <div className="footer_bar"></div>
        </footer>
      </article>
    </>
  );
}

export default Login;
