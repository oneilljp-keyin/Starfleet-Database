import { useState, useEffect } from "react";

import ufpLogo from "../assets/ufp_logo.png";

import EventsAndPhotosDataService from "../services/eventsAndPhotos";

function PhotoCarousel({ subjectId, isAuth, photoRefresh, setPhotoRefresh, imageType, OpenModal }) {
  const [photoArray, setPhotoArray] = useState([]);
  const [picTracker, setPicTracker] = useState([]);

  useEffect(() => {
    const getphotoArray = (id) => {
      EventsAndPhotosDataService.getAllPhotos(id)
        .then((response) => {
          setPhotoArray(response.data);
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
    getphotoArray(subjectId);
    setPhotoRefresh(false);
  }, [subjectId, photoRefresh, setPhotoRefresh]);

  return (
    <div
      id="photoCarousel"
      className={
        imageType === "officer"
          ? "carousel slide m-2 officer-pics"
          : "carousel slide m-2 starship-pics"
      }
      data-bs-ride="carousel"
    >
      <div className="carousel-indicators my-0">
        {photoArray.length > 1 &&
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
      <div className="carousel-inner">
        {photoArray.length > 0 ? (
          photoArray.map((photo, index) => {
            return (
              <div
                className={index === 0 ? "carousel-item active " : "carousel-item"}
                data-bs-interval="14400"
                key={index}
              >
                <img src={`${photo.url}`} className="d-block w-100" alt={photo.title} />
                {isAuth && (
                  <div className="cc-bg p-2 left-delete middle">
                    <button
                      className="edit"
                      onClick={() => {
                        OpenModal("delete", photo._id, "photo");
                      }}
                    >
                      <i className="fa-solid fa-remove fa-lg" style={{ color: "white" }}></i>
                    </button>
                  </div>
                )}
                <div className="carousel-caption cc-bg d-none d-sm-block p-1 middle">
                  <h5 className="m-0">
                    {photo.title} [<small>{photo.year}</small>]
                  </h5>
                  <p className="m-0">{photo.description}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <img src={ufpLogo} className="d-block w-100" alt="United Federation of Planets" />
          </div>
        )}
        {photoArray.length > 1 && (
          <>
            <button
              className="carousel-control-prev h-100"
              type="button"
              data-bs-target="#photoCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next h-100"
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

export default PhotoCarousel;
