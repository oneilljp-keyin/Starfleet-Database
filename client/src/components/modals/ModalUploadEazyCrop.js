import React, { useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";

import PersonnelDataService from "../../services/personnel";
import { getCroppedImg } from "../../utils/getCroppedImage";

const PopUpUpload = ({ isShowing, hide, isAuth, subjectId, setPhotoRefresh, imageType }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  // const cropSize = { width: 735, height: 350 };
  const [zoom, setZoom] = useState(2);
  const [file, setFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [cropperSrc, setCropperSrc] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);

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
    title: "",
    year: "",
    description: "",
    url: "",
    owner: subjectId,
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
    setPhotoRefresh(true);
    setFile(null);
    setIsFileSelected(false);
    setCroppedArea(null);
    hide();
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

          PersonnelDataService.insertPhoto(formData, photoInfo)
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
            <div className="modal-main-body">
              <div className="resize-modal resize-modal-content-wrapper">
                <div className="resize-modal-content-container align-content-center">
                  <div className="search-form m-auto text-center">
                    {!isFileSelected ? (
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
                    <button
                      className="lcars_btn orange_btn left_round small_btn"
                      onClick={handleOnSubmit}
                    >
                      Submit
                    </button>
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
