import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

import EventsAndPhotosDataService from "../../services/eventsAndPhotos";
import { getCroppedImg } from "../../utils/getCroppedImage";
import { Loading } from "../hooks/HooksAndFunctions";

const PopUpUpload = (props) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(2);
  const [file, setFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => setIsLoading(false), []);
  const [cropperSrc, setCropperSrc] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);

  const [edit, setEdit] = useState(false);
  const subjectId = props.entryType === "officer" ? props.officerId : props.starshipId;

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  let aspect = props.imageType === "starship" || props.entryType === "starship" ? 21 / 10 : 1;

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(cropperSrc, croppedArea, 0);
      return croppedImage;
    } catch (error) {
      console.error(error);
    }
  }, [cropperSrc, croppedArea]);

  const dropRef = useRef(); // React ref for managing the hover state of droppable area

  const initialPhotoState = {
    _id: "",
    title: "",
    year: "",
    description: "",
    url: "",
    owner: subjectId,
    primary: false,
  };
  const [photoInfo, setPhotoInfo] = useState(initialPhotoState);

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setCropperSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);

    setIsFileSelected(uploadedFile.name.match(/\.(jpeg|jpg|png)$/i));
  };

  const onChangeEvent = (e) => {
    setPhotoInfo({ ...photoInfo, [e.target.name]: e.target.value });
  };

  const handleChangeChk = (e) => {
    setPhotoInfo({ ...photoInfo, [e.target.name]: e.target.checked });
  };

  function DataURIToBlob(dataURI) {
    const splitDataURI = dataURI.split(",");
    const byteString =
      splitDataURI[0].indexOf("base64") >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(":")[1].split(";")[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);

    return new Blob([ia], { type: mimeString });
  }

  const closeModal = () => {
    setPhotoInfo(initialPhotoState);
    props.setRefresh();
    setFile(null);
    setIsFileSelected(false);
    setCroppedArea(null);
    props.hide();
  };

  useEffect(() => {
    setIsLoading(false);
    let isMounted = true;

    const getEvent = async (id) => {
      try {
        let response = await EventsAndPhotosDataService.getPhotoInfo(id);
        if (isMounted) {
          setPhotoInfo(response.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (props.photoId) {
      getEvent(props.photoId);
      setEdit(true);
    }
    return () => {
      isMounted = false;
    };
  }, [props.photoId]);

  const deletePhoto = async () => {
    setIsLoading(true);
    try {
      let response = await EventsAndPhotosDataService.deletePhoto(props.photoId);
      // setPhotoRefresh();
      toast.dark(response.data.message);
      closeModal();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const updatePhoto = async () => {
    setIsLoading(true);
    let data = photoInfo;
    Object.keys(data).forEach((key) => {
      if (data[key] === null || data[key] === "" || data[key] === undefined) {
        delete data[key];
      }
    });
    delete data["url"];
    delete data["owner"];
    try {
      let response = await EventsAndPhotosDataService.updatePhotoInfo(data);
      toast.dark(response.data.message);
      closeModal();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleOnSubmit = async () => {
    setIsLoading(true);
    try {
      const { title, year, description } = photoInfo;
      if (title.trim() !== "" && description.trim() !== "" && year.trim() !== "") {
        if (file) {
          let croppedFile = await showCroppedImage();
          let newFile = DataURIToBlob(croppedFile);

          const formData = new FormData();
          formData.append("file", newFile, subjectId);

          EventsAndPhotosDataService.insertPhoto(formData, photoInfo)
            .then((response) => {
              toast.dark(response.data.message);
              closeModal();
            })
            .catch((err) => {
              console.error(err);
              toast.error(err.message);
            });
        } else {
          toast.warning("Please select a file to add.");
        }
      } else {
        toast.warning("Please enter all the field values.");
      }
    } catch (error) {
      error.response && toast.error(error.response.data);
    }
    setIsLoading(false);
  };

  return props.isShowing && props.isAuth
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className="modal-open">
              <div className="modal-bg resize-modal resize-modal-content-wrapper">
                <div className="resize-modal-content-container align-content-center">
                  <div className="search-form m-auto text-center modal-appear">
                    {!isFileSelected && !edit ? (
                      <Dropzone onDrop={onDrop}>
                        {({ getRootProps, getInputProps }) => (
                          <div {...getRootProps({ className: "drop-zone" })} ref={dropRef}>
                            <input {...getInputProps()} />
                            <p className="text-center m-0">
                              Drag &amp; drop OR click <strong>HERE</strong> to select
                            </p>
                          </div>
                        )}
                      </Dropzone>
                    ) : photoInfo.url && edit ? (
                      <img
                        src={`${photoInfo.url}`}
                        className="d-block drop-zone mx-auto"
                        alt={photoInfo.title}
                      />
                    ) : (
                      <div className="cropper">
                        <Cropper
                          image={cropperSrc}
                          crop={crop}
                          zoom={zoom}
                          aspect={aspect}
                          onCropChange={setCrop}
                          onCropComplete={onCropComplete}
                          onZoomChange={setZoom}
                        />
                      </div>
                    )}
                    <div className="d-flex row form-group mx-2">
                      <div className="form-floating col-6">
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          name="title"
                          id="imageTitle"
                          placeholder="Image Title"
                          value={photoInfo.title || ""}
                          onChange={(e) => onChangeEvent(e)}
                        />
                        <label htmlFor="imageTitle">Image Title</label>
                      </div>
                      <div className="form-floating col-6">
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          name="year"
                          id="imageYear"
                          placeholder="Year"
                          value={photoInfo.year || ""}
                          onChange={(e) => onChangeEvent(e)}
                        />
                        <label htmlFor="imageYear">Year</label>
                      </div>
                      <div className="form-floating col-12">
                        <input
                          className="form-control form-control-sm"
                          type="text"
                          name="description"
                          id="imageDescription"
                          placeholder="Image Description"
                          value={photoInfo.description || ""}
                          onChange={(e) => onChangeEvent(e)}
                        />
                        <label htmlFor="imageDescription">Description</label>
                      </div>
                      <div className="col-sm-4 form-check align-items-center m-auto">
                        <input
                          className="form-check-input ms-1"
                          type="checkbox"
                          id="primary"
                          name="primary"
                          checked={photoInfo.primary || ""}
                          onChange={(e) => handleChangeChk(e)}
                          style={{ transform: "scale(1.8)" }}
                        />
                        <label className="form-check-label" htmlFor="primary">
                          Primary Photo
                        </label>
                      </div>
                    </div>
                    <button
                      className="lcars-btn orange-btn left-round small-btn"
                      onClick={edit ? updatePhoto : handleOnSubmit}
                    >
                      {edit ? "Update" : "Submit"}
                    </button>
                    {edit && (
                      <button
                        className="lcars-btn purple-btn all-square small-btn"
                        onClick={deletePhoto}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      className="lcars-btn red-btn right-round small-btn"
                      onClick={() => {
                        closeModal();
                      }}
                    >
                      Cancel
                    </button>
                    {isLoading ? <Loading /> : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};
export default PopUpUpload;
