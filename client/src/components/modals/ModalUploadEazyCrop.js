import React, { useState, useRef, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

import EventsAndPhotosDataService from "../../services/eventsAndPhotos";
import { getCroppedImg } from "../../utils/getCroppedImage";

const PopUpUpload = ({
  isShowing,
  hide,
  isAuth,
  subjectId,
  photoId,
  setRefresh,
  imageType,
  modalClass,
  setModalClass,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const cropSize = { width: 735, height: 350 };
  const [zoom, setZoom] = useState(2);
  const [file, setFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [cropperSrc, setCropperSrc] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);

  const [edit, setEdit] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  let aspect = imageType === "starship" ? 21 / 10 : 1;

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

    setIsFileSelected(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
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
    // setModalClass("modal-main-body modal-close");
    setPhotoInfo(initialPhotoState);
    setRefresh();
    setFile(null);
    setIsFileSelected(false);
    setCroppedArea(null);
    hide();
  };

  useEffect(() => {
    const getEvent = async (id) => {
      try {
        let response = await EventsAndPhotosDataService.getPhotoInfo(id);
        setPhotoInfo(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    if (photoId) {
      getEvent(photoId);
      setEdit(true);
    }
  }, [photoId]);

  const deletePhoto = async () => {
    try {
      let response = await EventsAndPhotosDataService.deletePhoto(photoId);
      toast.dark(response.data.message);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const updatePhoto = async () => {
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
  };

  const handleOnSubmit = async () => {
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
              toast.success(response.data.message);
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
  };

  return isShowing && isAuth
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div className="modal-wrapper" aria-modal aria-hidden tabIndex={-1} role="dialog">
            <div className={modalClass}>
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
                          className="form-control form-control-sm my-1"
                          type="text"
                          name="title"
                          id="imageTitle"
                          placeholder="Image Title"
                          value={photoInfo.title}
                          onChange={(e) => onChangeEvent(e)}
                        />
                        <label htmlFor="imageTitle">Image Title</label>
                      </div>
                      <div className="form-floating col-6">
                        <input
                          className="form-control form-control-sm my-1"
                          type="text"
                          name="year"
                          id="imageYear"
                          placeholder="Year"
                          value={photoInfo.year}
                          onChange={(e) => onChangeEvent(e)}
                        />
                        <label htmlFor="imageYear">Year</label>
                      </div>
                      <div className="form-floating col-12">
                        <input
                          className="form-control form-control-sm my-1"
                          type="text"
                          name="description"
                          id="imageDescription"
                          placeholder="Image Description"
                          value={photoInfo.description}
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
                      className="lcars_btn orange_btn left_round small_btn"
                      onClick={edit ? updatePhoto : handleOnSubmit}
                    >
                      {edit ? "Update" : "Submit"}
                    </button>
                    {edit && (
                      <button
                        className="lcars_btn purple_btn all_square small_btn"
                        onClick={deletePhoto}
                      >
                        Delete
                      </button>
                    )}
                    <button
                      className="lcars_btn red_btn right_round small_btn"
                      onClick={() => {
                        closeModal();
                      }}
                    >
                      Cancel
                    </button>
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
