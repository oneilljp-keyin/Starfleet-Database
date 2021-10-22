import { useState, useEffect } from "react";

import PersonnelDataService from "../../services/personnel";

function OfficerProfilePics({ officerId, isAuth, photoRefresh, setPhotoRefresh }) {
  const [officerPics, setOfficerPics] = useState([]);
  const [picTracker, setPicTracker] = useState([]);

  useEffect(() => {
    const getOfficerPics = (id) => {
      PersonnelDataService.getAllPhotos(id)
        .then((response) => {
          setOfficerPics(response.data);
          let array = [];
          for (let i = 0; i < response.data.length; i++) {
            array.push(i);
          }
          setPicTracker(array);
        })
        .catch((err) => {
          console.error(err);
        });
    };
    getOfficerPics(officerId);
    setPhotoRefresh(false);
  }, [officerId, photoRefresh, setPhotoRefresh]);

  return (
    <div id="photoCarousel" className="carousel slide officer-pics m-2" data-bs-ride="carousel">
      <div className="carousel-indicators my-0">
        {officerPics.length > 0 &&
          picTracker.map((index) => {
            if (index === 0) {
              return (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#photoCarousel"
                  data-bs-slide-to={index}
                  className="active"
                  aria-current="true"
                  aria-label={"Slide " + (index + 1).toString()}
                ></button>
              );
            } else {
              return (
                <button
                  key={index}
                  type="button"
                  data-bs-target="#photoCarousel"
                  data-bs-slide-to={index}
                  aria-label={"Slide " + (index + 1).toString()}
                ></button>
              );
            }
          })}
      </div>
      <div className="carousel-inner h-100">
        {officerPics.length > 0 &&
          officerPics.map((photo, index) => {
            let data8 = new Uint8Array(photo.image.data);
            let file = new File([data8], { type: "image/png" });
            const url = URL.createObjectURL(file);
            return (
              <div
                className={index === 0 ? "carousel-item active " : "carousel-item"}
                data-bs-interval="1000000"
                key={index}
              >
                <img src={url} className="d-block w-100" alt={photo.title} />
                <div className="carousel-caption cc-bg d-none d-sm-block p-0 middle">
                  <h5 className="m-0">
                    {photo.title} [<small>{photo.year}</small>]
                  </h5>
                  <p className="m-0">{photo.description}</p>
                </div>
              </div>
            );
          })}
        {officerPics.length > 0 && (
          <>
            <button
              className="carousel-control-prev h-75"
              type="button"
              data-bs-target="#photoCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next h-75"
              type="button"
              data-bs-target="#photoCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default OfficerProfilePics;
