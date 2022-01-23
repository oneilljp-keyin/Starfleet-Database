import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

import PersonnelDataService from "../../services/personnel";

const PopUpUpload = ({ isShowing, hide, isAuth, subjectId, setPhotoRefresh, imageType }) => {
  const [previewSrc, setPreviewSrc] = useState(null); // state for storing previewImage
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const [file, setFile] = useState(null); // state for storing actual image
  const [croppedImg, setCroppedImg] = useState(null); // state for storing actual image

  const cropperRef = useRef(null);
  const dropRef = useRef(); // React ref for managing the hover state of droppable area

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setCroppedImg(cropper.getCroppedCanvas().toDataURL());
  };

  const initialPhotoState = {
    title: "",
    year: "",
    description: "",
  };
  const [photoInfo, setPhotoInfo] = useState(initialPhotoState);

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
    // dropRef.current.style.border = "2px dashed #9c96ffe6";
  };

  // const updateBorder = (dragState) => {
  //   if (dragState === "over") {
  //     dropRef.current.style.border = "2px solid #000";
  //   } else if (dragState === "leave") {
  //     dropRef.current.style.border = "";
  //   }
  // };

  const onChangeEvent = (e) => {
    setPhotoInfo({ ...photoInfo, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async () => {
    try {
      const { title, year, description } = photoInfo;
      if (title.trim() !== "" && description.trim() !== "" && year.trim() !== "") {
        if (file) {
          const formData = new FormData();
          formData.append("file", croppedImg);
          formData.append("title", title);
          formData.append("year", year);
          formData.append("description", description);
          formData.append("_id", subjectId);
          formData.append("imageType", imageType);

          console.log(formData);

          PersonnelDataService.insertPhoto(formData)
            .then((response) => {
              setPhotoRefresh(true);
              setFile(null);
              setIsPreviewAvailable(false);
              toast.success(response.message.data);
              closeModal();
            })
            .catch((err) => {
              console.error(err);
              toast.warning(err.message);
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
  const closeModal = () => {
    setPhotoInfo(initialPhotoState);
    hide();
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
                    {!isPreviewAvailable ? (
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
                      <div className="relative w-full">
                        <Cropper
                          src={previewSrc}
                          style={{ height: 300 }}
                          initialAspectRatio={1}
                          guides={false}
                          crop={onCrop}
                          ref={cropperRef}
                          viewMode={1}
                          minCropBoxHeight={10}
                          minCropBoxWidth={10}
                          responsive={true}
                          autoCropArea={1}
                          aspectRatio={1}
                          checkOrientation={false}
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
                        setPreviewSrc(null);
                        setFile(null);
                        setIsPreviewAvailable(false);
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
