import { useState } from "react";
import PersonnelDataService from "../../services/personnel";
import { Link } from "react-router-dom";

const COUOfficer = (props) => {
  const initialOfficerState = {
    id: null,
    surname: null,
    first: null,
    middle: null,
    postNom: null,
    birthDate: null,
    birthStardate: null,
    birthPlace: null,
    birthNote: null,
    deathDate: null,
    deathStardate: null,
    deathPlace: null,
    deathNote: null,
    serial: null,
  };

  let editing = false;
  let [btnLabel, setBtnLabel] = useState("Create");

  if (props.location.state && props.location.state.currentEvent) {
    editing = true;
    setBtnLabel("Update");
    initialOfficerState = props.location.state.currentEvent.text;
  }

  const [officer, setOfficer] = useState(initialOfficerState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    setOfficer(e.target.value);
  };

  const saveEvent = () => {
    let data = {
      // text: review,
      // name: props.user.name,
      // user_id: props.user.user_id,
      // personnel_id: props.match.params.id,
    };

    if (editing) {
      data.review_id = props.location.state.currentEvent._id;
      PersonnelDataService.updateReview(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      PersonnelDataService.createEvent(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return <>Create of Edit Officer Profile</>;
};

export default COUOfficer;
