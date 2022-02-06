import { useState } from "react";

function useModalUploadEazyCrop() {
  const [isShowingModalUploadEazyCrop, setIsShowingModalUploadEazyCrop] = useState(false);

  function toggleModalUploadEazyCrop() {
    setIsShowingModalUploadEazyCrop(!isShowingModalUploadEazyCrop);
  }

  return {
    isShowingModalUploadEazyCrop,
    toggleModalUploadEazyCrop,
  };
}

export default useModalUploadEazyCrop;
