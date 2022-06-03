import { useState } from "react";

function useModal() {
  const [isShowingModal, setIsShowingModal] = useState(false);

  function toggleModal() {
    setIsShowingModal(!isShowingModal);
  }

  return {
    isShowingModal,
    toggleModal,
  };
}

export default useModal;
