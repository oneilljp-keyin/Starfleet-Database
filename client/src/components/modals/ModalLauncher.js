import ModalOfficer from "../modals/ModalOfficer";
import ModalStarship from "../modals/ModalStarship";
import ModalEvent from "../modals/ModalEvent";
import ModalUploadEazyCrop from "../modals/ModalUploadEazyCrop";
import ModalDelete from "../modals/ModalDelete";
import ModalSignin from "../modals/ModalSignin";
import ModalList from "../modals/ModalList";

const ModalLauncher = (props) => {
  const modalClass = "main-modal-body modal-open";

  switch (props.modal) {
    case "event":
      return (
        <ModalEvent
          isShowing={props.isShowing}
          hide={props.hide}
          isAuth={props.isAuth}
          officerId={props.officerId}
          starshipId={props.starshipId}
          eventId={props.eventId}
          subjectName={props.subjectName}
          setRefresh={props.setRefresh}
          eventType={props.type}
          modalClass={modalClass}
        />
      );
    case "photo":
      let subjectId = props.type === "starship" ? props.starshipId : props.officerId;
      return (
        <ModalUploadEazyCrop
          isShowing={props.isShowing}
          hide={props.hide}
          isAuth={props.isAuth}
          subjectId={subjectId}
          setRefresh={props.setRefresh}
          setPhotoRefresh={props.setPhotoRefresh}
          imageType={props.type}
          modalClass={modalClass}
          photoId={props.photoId}
        />
      );
    case "officer":
      return (
        <ModalOfficer
          isShowing={props.isShowing}
          hide={props.hide}
          isAuth={props.isAuth}
          officerId={props.officerId}
          subjectName={props.subjectName}
          setRefresh={props.setRefresh}
          modalClass={modalClass}
        />
      );
    case "starship":
      return (
        <ModalStarship
          isShowing={props.isShowing}
          hide={props.hide}
          isAuth={props.isAuth}
          starshipId={props.starshipId}
          subjectName={props.subjectName}
          setRefresh={props.setRefresh}
          modalClass={modalClass}
        />
      );
    case "delete":
      return (
        <ModalDelete
          isShowing={props.isShowing}
          hide={props.hide}
          isAuth={props.isAuth}
          officerId={props.officerId}
          starshipId={props.starshipId}
          eventId={props.eventId}
          setRefresh={props.setRefresh}
          recordType={props.type}
          modalClass={modalClass}
        />
      );
    case "signin":
      return (
        <ModalSignin
          isShowing={props.isShowing}
          hide={props.hide}
          modalClass={modalClass}
          setAuth={props.setAuth}
          setAdmin={props.setAdmin}
        />
      );
    case "list":
      return (
        <ModalList
          isShowing={props.isShowing}
          isAuth={props.isAuth}
          hide={props.hide}
          modalClass={modalClass}
          subjectName={props.subjectName}
          officerId={props.officerId}
          starshipId={props.starshipId}
          listType={props.type}
          category={props.category}
        />
      );
    default:
      return "";
  }
};

export default ModalLauncher;
