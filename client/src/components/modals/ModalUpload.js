import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import Dropzone from "react-dropzone";
import { toast } from "react-toastify";
import axios from "axios";

const PopUpUpload = ({ isShowing, hide, isAuth, subjectId, setPhotoRefresh, imageType }) => {
  const [previewSrc, setPreviewSrc] = useState(""); // state for storing previewImage
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false); // state to show preview only for images
  const [file, setFile] = useState(null); // state for storing actual image
  const dropRef = useRef(); // React ref for managing the hover state of droppable area
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
    dropRef.current.style.border = "2px dashed #9c96ffe6";
  };

  const updateBorder = (dragState) => {
    if (dragState === "over") {
      dropRef.current.style.border = "2px solid #000";
    } else if (dragState === "leave") {
      dropRef.current.style.border = "";
    }
  };

  const onChangeEvent = (e) => {
    setPhotoInfo({ ...photoInfo, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async () => {
    try {
      const { title, year, description } = photoInfo;
      if (title.trim() !== "" && description.trim() !== "" && year.trim() !== "") {
        if (file) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", title);
          formData.append("year", year);
          formData.append("description", description);
          formData.append("_id", subjectId);
          formData.append("imageType", imageType);

          let response = await axios.post(
            "http://localhost:8000/api/v1/sfdatabase/photos/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setPhotoRefresh(true);
          setFile(null);
          setIsPreviewAvailable(false);
          toast.success(response.message.data);
          closeModal();
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
              <div className="upload-modal modal-content-wrapper">
                <div className="modal-content-container align-content-center">
                  <div className="search-form m-auto text-center">
                    <Dropzone
                      onDrop={onDrop}
                      onDragEnter={() => updateBorder("over")}
                      onDragLeave={() => updateBorder("leave")}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps({ className: "drop-zone" })} ref={dropRef}>
                          <input {...getInputProps()} />
                          <p className="text-center m-0">
                            Drag &amp; drop OR click <strong>HERE</strong> to select
                          </p>
                          {isPreviewAvailable && (
                            <div className="image-preview">
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
                    <button
                      className="lcars_btn orange_btn left_round small_btn"
                      onClick={handleOnSubmit}
                    >
                      Submit
                    </button>
                    <button
                      className="lcars_btn red_btn right_round small_btn"
                      onClick={closeModal}
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
