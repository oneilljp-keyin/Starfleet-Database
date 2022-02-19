import ModalOfficer from "../modals/ModalOfficer";
import ModalStarship from "../modals/ModalStarship";
import ModalEvent from "../modals/ModalEvent";
import ModalUploadEazyCrop from "../modals/ModalUploadEazyCrop";
import ModalDelete from "../modals/ModalDelete";
import ModalSignin from "../modals/ModalSignin";

const ModalLauncher = ({
  modal,
  isShowing,
  hide,
  isAuth,
  officerId,
  starshipId,
  eventId,
  subjectName,
  imageType,
  setRefreshOption,
  setAuth,
  setAdmin,
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
          setRefresh={setRefreshOption}
          eventType={imageType}
          modalClass={modalClass}
        />
      );
    case "photo":
      let subjectId = imageType === "starship" ? starshipId : officerId;
      return (
        <ModalUploadEazyCrop
          isShowing={isShowing}
          hide={hide}
          isAuth={isAuth}
          subjectId={subjectId}
          setRefresh={setRefreshOption}
          imageType={imageType}
          modalClass={modalClass}
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
          setRefresh={setRefreshOption}
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
          setRefresh={setRefreshOption}
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
          setRefresh={setRefreshOption}
          recordType={imageType}
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
    default:
      return "";
  }
};

export default ModalLauncher;
