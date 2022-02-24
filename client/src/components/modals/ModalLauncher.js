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
  subjectName,
  type,
  setRefreshOption,
  setAuth,
  setAdmin,
  category,
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
          setRefresh={setRefreshOption}
          imageType={type}
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
          hide={hide}
          modalClass={modalClass}
          starshipName={subjectName}
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
