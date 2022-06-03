import axios from "axios";
import http from "../http-common";

class EventsAndPhotosDataService {
  insertEvent(eventInfo) {
    return http.post("/events", eventInfo);
  }

  getEvent(id) {
    return http.get(`/events?id=${id}`);
  }

  getEventsByCategory(officerId = "", starshipId = "", category = "", sort = 1) {
    let urlQuery = "";
    if (category && category !== "" && category !== undefined && category !== null) {
      urlQuery += "category=" + category;
    }
    if (officerId && officerId !== "" && officerId !== undefined && officerId !== null) {
      if (urlQuery.length > 0) urlQuery += "&";
      urlQuery += "officer_id=" + officerId;
    }
    if (starshipId && starshipId !== "" && starshipId !== undefined && starshipId !== null) {
      if (urlQuery.length > 0) urlQuery += "&";
      urlQuery += "starship_id=" + starshipId;
    }
    return http.get(`/events?${urlQuery}&sort=${sort}`);
  }

  updateEvent(eventInfo) {
    return http.put("/events", eventInfo);
  }

  deleteEvent(eventId) {
    return http.delete(`/events?id=${eventId}`);
  }

  async insertPhoto(formData, photoInfo) {
    let uploadResult = await axios.post(
      "https://sector709.johnny-o.net/images/upload.php",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    photoInfo.url = uploadResult.data.url;

    return http.post("/photos", photoInfo);
  }

  getPhotoInfo(photoId) {
    return http.get(`/photos?id=${photoId}`);
  }

  getAllPhotos(subjectId) {
    return http.get(`/photos?subject_id=${subjectId}`);
  }

  deletePhoto(photoId) {
    return http.delete(`/photos?id=${photoId}`);
    // // console.log(deleteResults.data);
    // console.log(JSON.stringify(deleteResults.data));
    // let photoName = deleteResults.data.photoURL.replace(
    //   "https://sector709.johnny-o.net/images/",
    //   ""
    // );
    // let deleteFile = axios.delete("https://sector709.johnny-o.net/images/upload.php", photoName, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // return deleteFile;
  }

  updatePhotoInfo(photoInfo) {
    return http.put("/photos", photoInfo);
  }
}

export default new EventsAndPhotosDataService();
