import { useState } from "react";

function useModalUploadCropper() {
  const [isShowingModalUploadCropper, setIsShowingModalUploadCropper] = useState(false);

  function toggleModalUploadCropper() {
    setIsShowingModalUploadCropper(!isShowingModalUploadCropper);
  }

  return {
    isShowingModalUploadCropper,
    toggleModalUploadCropper,
  };
}

export default useModalUploadCropper;
