import { useState, useEffect } from "react";
import StarshipsDataService from "../services/starships";

const Starships = (props) => {
  const database = props.database;
  console.log(props.match.params.id);

  const initialStarshipsState = {
    id: null,
    ship_id: null,
    name: null,
    registry: null,
    class: null,
    launch: null,
    commission: null,
    decommission: null,
    destruction: null,
  };

  const [starship, setStarship] = useState(initialStarshipsState);
  console.log(starship);

  useEffect(() => {
    const getStarship = (id) => {
      StarshipsDataService.get(id, database)
        .then((response) => {
          setStarship(response.data);
          console.log(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    getStarship(props.match.params.id);
  }, [props.match.params.id, database]);

  return (
    <>
      {starship ? (
        <div>
          {starship.name && <h1>U.S.S. {starship.name}</h1>}
          {starship.registry && <h2>{starship.registry}</h2>}
          {starship.class && <h3>{starship.class} Class</h3>}
          <p>
            {starship.launch && (
              <>
                <strong>Date of Launch: </strong>
                {starship.launch.slice(0, 4)}
                <br />
              </>
            )}
            {starship.commission && (
              <>
                <strong>Date of Commission: </strong>
                {starship.commission.slice(0, 4)}
                <br />
              </>
            )}
            {starship.decommission && (
              <>
                <strong>Date of Decommission: </strong>
                {starship.decommission.slice(0, 4)}
                <br />
              </>
            )}
            {starship.destruction && (
              <>
                <strong>Date of Destruction: </strong>
                {starship.destruction.slice(0, 4)}
                <br />
              </>
            )}
          </p>
        </div>
      ) : (
        <div>
          <br />
          <p>No Starship Selected</p>
        </div>
      )}
    </>
  );
};

export default Starships;
