import ModalOfficer from "../modals/ModalOfficer";
import ModalStarship from "../modals/ModalStarship";
import ModalUploadEazyCrop from "../modals/ModalUploadEazyCrop";
import ModalEvent from "../modals/ModalEvent";

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
    default:
      return "";
  }
};

export default ModalLauncher;
