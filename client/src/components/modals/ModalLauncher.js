import ModalOfficer from "../modals/ModalOfficer";
import ModalStarship from "../modals/ModalStarship";
import ModalEvent from "../modals/ModalEvent";
import ModalUploadEazyCrop from "../modals/ModalUploadEazyCrop";
import ModalDelete from "../modals/ModalDelete";
import ModalSignin from "../modals/ModalSignin";
import ModalList from "../modals/ModalList";

const ModalLauncher = ({
  modal,
  isShowing,
  hide,
  isAuth,
  officerId,
  starshipId,
  eventId,
  photoId,
  subjectName,
  type, // Officer or Starship
  setRefresh,
  setPhotoRefresh,
  setAuth,
  setAdmin,
  category, //
}) => {
  const modalClass = "main-modal-body modal-open";

  switch (modal) {
    case "event":
      return (
        <ModalEvent
          isShowing={isShowing}
          hide={hide}
          isAuth={isAuth}
          officerId={officerId}
          starshipId={starshipId}
          eventId={eventId}
          subjectName={subjectName}
          setRefresh={setRefresh}
          eventType={type}
          modalClass={modalClass}
        />
      );
    case "photo":
      let subjectId = type === "starship" ? starshipId : officerId;
      return (
        <ModalUploadEazyCrop
          isShowing={isShowing}
          hide={hide}
          isAuth={isAuth}
          subjectId={subjectId}
          setRefresh={setRefresh}
          setPhotoRefresh={setPhotoRefresh}
          imageType={type}
          modalClass={modalClass}
          photoId={photoId}
        />
      );
    case "officer":
      return (
        <ModalOfficer
          isShowing={isShowing}
          hide={hide}
          isAuth={isAuth}
          officerId={officerId}
          subjectName={subjectName}
          setRefresh={setRefresh}
          modalClass={modalClass}
        />
      );
    case "starship":
      return (
        <ModalStarship
          isShowing={isShowing}
          hide={hide}
          isAuth={isAuth}
          starshipId={starshipId}
          subjectName={subjectName}
          setRefresh={setRefresh}
          modalClass={modalClass}
        />
      );
    case "delete":
      return (
        <ModalDelete
          isShowing={isShowing}
          hide={hide}
          isAuth={isAuth}
          officerId={officerId}
          starshipId={starshipId}
          eventId={eventId}
          setRefresh={setRefresh}
          recordType={type}
          modalClass={modalClass}
        />
      );
    case "signin":
      return (
        <ModalSignin
          isShowing={isShowing}
          hide={hide}
          modalClass={modalClass}
          setAuth={setAuth}
          setAdmin={setAdmin}
        />
      );
    case "list":
      return (
        <ModalList
          isShowing={isShowing}
          isAuth={isAuth}
          hide={hide}
          modalClass={modalClass}
          subjectName={subjectName}
          officerId={officerId}
          starshipId={starshipId}
          listType={type}
          category={category}
        />
      );
    default:
      return "";
  }
};

export default ModalLauncher;
