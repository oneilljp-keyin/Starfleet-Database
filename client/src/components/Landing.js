import { useState, useEffect } from "react";

import PersonnelDataService from "../services/personnel";

function Login({ setAuth, userId, getProfile, userName }) {
  const [history, setHistory] = useState({});

  const searchHistory = (userId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/personnel/history/${userId}`, {
        method: "GET",
        headers: { token: localStorage.token },
      });

      const parseData = await response.json();
    } catch (err) {
      console.error(err.message);
    }

    // PersonnelDataService.searchHistory(id)
    //   .then((response) => {
    //     console.log(response.data);
    //     setHistory(response.data.history);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  };

  useEffect(() => {
    searchHistory(userId);
  }, [userId]);

  return (
    <>
      <div>
        <h3>
          Welcome to Sector 709 {userName && ","} {userName}
        </h3>
        <p></p>
      </div>
    </>
  );
}

export default Login;
