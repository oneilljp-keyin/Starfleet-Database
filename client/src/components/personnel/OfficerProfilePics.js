import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Dropzone from "react-dropzone";
import axios from "axios";

import PersonnelDataService from "../../services/personnel";

function OfficerProfilePics({ officerId, isAuth }) {
  const [photoRefresh, setPhotoRefresh] = useState(false);
  const [officerPics, setOfficerPics] = useState([]);
  const [arrayPlusOne, setArrayPlusOne] = useState([]);
  const [file, setFile] = useState(null); // state for storing actual image
  const [previewSrc, setPreviewSrc] = useState(""); // state for storing previewImage
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const dropRef = useRef(); // React ref for managing the hover state of droppable area
  const [photoInfo, setPhotoInfo] = useState({
    title: "",
    year: "",
    description: "",
  });

  useEffect(() => {
    const getOfficerPics = (id) => {
      PersonnelDataService.getAllPhotos(id)
        .then((response) => {
          setOfficerPics(response.data);
          let array = [];
          for (let i = 0; i < response.data.length; i++) {
            array.push(i);
          }
          if (isAuth) {
            array.push(response.data.length);
          }
          setArrayPlusOne(array);
          setIsPreviewAvailable(false);
          setPhotoInfo({ title: "", year: "", description: "" });
          setFile(null);
          updateBorder("over");
        })
        .catch((err) => {
          console.error(err);
        });
      setPhotoRefresh(false);
    };
    getOfficerPics(officerId);
  }, [officerId, photoRefresh, isAuth]);

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
    dropRef.current.style.border = "2px dashed #e9ebeb";
  };

  const updateBorder = (dragState) => {
    if (dragState === "over") {
      dropRef.current.style.border = "2px solid #000";
    } else if (dragState === "leave") {
      dropRef.current.style.border = "2px dashed #e9ebeb";
    }
  };

  const onChangeEvent = (e) => {
    setPhotoInfo({ ...photoInfo, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    try {
      const { title, year, description } = photoInfo;
      if (title.trim() !== "" && description.trim() !== "" && year.trim() !== "") {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", title);
          formData.append("year", year);
          formData.append("description", description);
          formData.append("_id", officerId);

          let response = await axios.post(
            "http://localhost:8000/api/v1/sfdatabase/personnel/photos/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setPhotoRefresh(true);
          toast.success(response.message.data);
        } else {
          toast.warning("Please select a file to add.");
        }
      } else {
        toast.warning("Please enter all the field values.");
      }
    } catch (error) {
      error.response && toast.error(error.response.data);
    }
  };

  return (
    <div id="photoCarousel" className="carousel slide officer-pics m-2" data-bs-ride="carousel">
      <div className="carousel-indicators my-0">
        {officerPics.length > 0 &&
          arrayPlusOne.map((index) => {
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
        {isAuth && (
          <div
            className={
              officerPics.length === 0 ? "carousel-item h-100 active" : "carousel-item h-100"
            }
            data-bs-interval="1000000"
          >
            <form className="search-form m-auto text-center h-100" onSubmit={handleOnSubmit}>
              <Dropzone
                onDrop={onDrop}
                onDragEnter={() => updateBorder("over")}
                onDragLeave={() => updateBorder("leave")}
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps({ className: "drop-zone h-50" })} ref={dropRef}>
                    <input {...getInputProps()} />
                    <p className="text-center m-0">
                      Drag &amp; drop OR click <strong>HERE</strong> to select
                    </p>
                    {isPreviewAvailable && (
                      <div className="image-preview h-75">
                        <img className="preview-image" src={previewSrc} alt="Preview" />
                      </div>
                    )}
                  </div>
                )}
              </Dropzone>
              <div className="d-flex row">
                <input
                  className="col form-control form-control-sm my-1"
                  type="text"
                  name="title"
                  placeholder="Image Title"
                  value={photoInfo.title}
                  onChange={(e) => onChangeEvent(e)}
                />
                <input
                  className="col form-control form-control-sm my-1"
                  type="text"
                  name="year"
                  placeholder="Year"
                  value={photoInfo.year}
                  onChange={(e) => onChangeEvent(e)}
                />
              </div>
              <input
                className="col form-control form-control-sm my-1"
                type="text"
                name="description"
                placeholder="Image Description"
                value={photoInfo.description}
                onChange={(e) => onChangeEvent(e)}
              />
              <button className="lcars_btn red_btn all_round small_btn m-2">Submit</button>
            </form>
          </div>
        )}
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
