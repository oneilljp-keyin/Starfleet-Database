// import { useState, useEffect } from "react";

// import PersonnelDataService from "../services/personnel";

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
          <h3>
            Welcome to Sector 709{userName && ","} {userName}
          </h3>
        </header>
        <div className="article_content">
          <p>These are some recommended searches for the database </p>
          <ul>
            <li>
              Kirk will bring up muliple results, namely the famous James T. Kirk, his father George
              and Mother Winona.
            </li>
            <li>
              Crusher will result in Dr. Beverly Crusher from the Enterprise-D, and her son Wesley,
              and husband Jack.
            </li>
            <li>
              The are numerous entries in the database, so any name you may have heard related to
              Star Trek will be listed (if they served in Starfleet). Enjoy
            </li>
          </ul>
        </div>
        <footer>
          <a href="http://johnoneill.tech" target="_blank" rel="noreferrer">
            johnoneill.tech
          </a>
          <div className="footer_bar"></div>
        </footer>
      </article>
    </>
  );
}

export default Login;
