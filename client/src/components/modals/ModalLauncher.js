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
      return <ModalEvent {...props} modalClass={modalClass} />;
    case "photo":
      return <ModalUploadEazyCrop {...props} />;
    case "officer":
      return <ModalOfficer {...props} modalClass={modalClass} />;
    case "starship":
      return <ModalStarship {...props} modalClass={modalClass} />;
    case "delete":
      return <ModalDelete {...props} modalClass={modalClass} />;
    case "signin":
      return <ModalSignin {...props} modalClass={modalClass} />;
    case "list":
      return <ModalList {...props} modalClass={modalClass} />;
    default:
      return "";
  }
};

export default ModalLauncher;
