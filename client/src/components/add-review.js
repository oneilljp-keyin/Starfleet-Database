import { useState } from "react";
import PersonnelDataService from "../services/personnel";
import { Link } from "react-router-dom";

const AddEvent = (props) => {
  let initialReviewState = "";

  let editing = false;

  if (props.location.state && props.location.state.currentEvent) {
    editing = true;
    initialReviewState = props.location.state.currentEvent.text;
  }

  const [event, setEvent] = useState(initialReviewState);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (event) => {
    setEvent(event.target.value);
  };

  const saveEvent = () => {
    let data = {
      text: review,
      name: props.user.name,
      user_id: props.user.user_id,
      personnel_id: props.match.params.id,
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

  return (
    <>
      {props.user ? (
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Link to={"/personnel/" + props.match.params.id} className="btn btn-success">
                Back To Restaruant
              </Link>
            </div>
          ) : (
            <div>
              <div className="form-group">
                <label htmlFor="description">{editing ? "Edit" : "Create"}</label>
                <input
                  type="text"
                  className="form-control"
                  id="text"
                  required
                  value={review}
                  onChange={handleInputChange}
                  name="text"
                />
              </div>
              <button onClick={saveReview} className="btn btn-success">
                Submit
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>Please Log In</div>
      )}
    </>
  );
};

export default AddReview;
