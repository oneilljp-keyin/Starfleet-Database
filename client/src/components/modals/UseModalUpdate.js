import { useState } from "react";

function useModalUpdate() {
  const [isShowingModalUpdate, setIsShowingModalUpdate] = useState(false);

  function toggleModalUpdate() {
    setIsShowingModalUpdate(!isShowingModalUpdate);
  }

  return {
    isShowingModalUpdate,
    toggleModalUpdate,
  };
}

export default useModalUpdate;
