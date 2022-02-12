import React, { useState, useEffect } from "react";
import StarshipsDataService from "../../services/starships";

function StarshipsSame({ starshipName, starshipClass = "Unknown", starshipId }) {
  const [starshipsSame, setStarshipsSame] = useState([]);

  useEffect(() => {
    StarshipsDataService.findSame(starshipName, starshipClass, 0)
      .then((response) => {
        setStarshipsSame(response.data);
        console.log("Same Name Starships" + response.data.starships);
      })
      .catch((e) => {
        console.error(e.message);
      });
  }, [starshipName, starshipClass]);

  console.log(starshipName + " [" + starshipClass + "]");
  console.log(starshipsSame);

  {starshipName ? return (<></>); : return (<></>);}
}

export default StarshipsSame;
