import { useState } from "react";

function OfficerProfilePics({ officerID }) {
  const [officerPics, setOfficerPics] = useState([]);

  const getOfficer = (id) => {
    PersonnelDataService.get(id, database)
      .then((response) => {
        setOfficer(response.data);
        // console.log(response.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return <div></div>;
}

export default OfficerProfilePics;
