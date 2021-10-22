import { useState } from "react";

function useModalUpload() {
  const [isShowingModalUpload, setIsShowingModalUpload] = useState(false);

  function toggleModalUpload() {
    setIsShowingModalUpload(!isShowingModalUpload);
  }

  return {
    isShowingModalUpload,
    toggleModalUpload,
  };
}

export default useModalUpload;
