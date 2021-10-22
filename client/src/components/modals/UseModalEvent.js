import { useState } from "react";

function useModalEvent() {
  const [isShowingModalEvent, setIsShowingModalEvent] = useState(false);

  function toggleModalEvent() {
    setIsShowingModalEvent(!isShowingModalEvent);
  }

  return {
    isShowingModalEvent,
    toggleModalEvent,
  };
}

export default useModalEvent;
