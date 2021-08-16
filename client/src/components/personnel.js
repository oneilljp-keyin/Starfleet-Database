import { useState, useEffect } from "react";
import PersonnelDataService from "../services/personnel";
import { Link } from "react-router-dom";

const Personnel = (props) => {
  const initialPersonnelState = {
    id: null,
    name: "",
    address: {},
    cuisine: "",
    reviews: [],
  };

  const [personnel, setPersonnel] = useState(initialPersonnelState);

  const getPersonnel = (id) => {
    PersonnelDataService.get(id)
      .then((response) => {
        setPersonnel(response.data);
        // console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    getPersonnel(props.match.params.id);
  }, [props.match.params.id]);

  const deleteReview = (reviewId, index) => {
    PersonnelDataService.deleteReview(reviewId, props.user.id)
      .then((response) => {
        setPersonnel((prevState) => {
          prevState.reviews.splice(index, 1);
          return {
            ...prevState,
          };
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // console.log(props.user);

  return (
    <>
      {personnel ? (
        <div>
          <h5>{personnel.name}</h5>
          <p>
            <strong>Cuisine: </strong>
            {personnel.cuisine}
            <br />
            <strong>Address: </strong>
            {personnel.address.building} {personnel.address.street}, {personnel.address.zipcode}
          </p>
          <Link to={"/personnel/" + props.match.params.id + "/review"} className="btn btn-primary">
            Add Review
          </Link>
          <h4> Reviews </h4>
          <div className="row">
            {personnel.reviews.length > 0 ? (
              personnel.reviews.map((review, index) => {
                return (
                  <div className="col-lg-4 pb-1" key={index}>
                    <div className="card">
                      <div className="card-body">
                        <p className="card-text">
                          {review.text}
                          <br />
                          <strong>User: </strong>
                          {review.name}
                          <br />
                          <strong>Date: </strong>
                          {review.date}
                        </p>
                        {props.user && props.user.id === review.user_id && (
                          <div className="row">
                            <button
                              onClick={() => deleteReview(review.user_id, index)}
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Delete
                            </button>
                            <Link
                              to={{
                                pathname: "/personnel/" + props.match.params.id + "/review",
                                state: { currentReview: review },
                              }}
                              className="btn btn-primary col-lg-5 mx-1 mb-1"
                            >
                              Edit
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-sm-4">
                <p>No Reviews Yet</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <p>No Personnel Selected</p>
        </div>
      )}
    </>
  );
};

export default Personnel;
