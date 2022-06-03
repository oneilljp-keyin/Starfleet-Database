import { useState } from "react";

function useModalOfficer() {
  const [isShowingModalOfficer, setIsShowingModalOfficer] = useState(false);

  function toggleModalOfficer() {
    setIsShowingModalOfficer(!isShowingModalOfficer);
  }

  return {
    isShowingModalOfficer,
    toggleModalOfficer,
  };
}

export default useModalOfficer;
