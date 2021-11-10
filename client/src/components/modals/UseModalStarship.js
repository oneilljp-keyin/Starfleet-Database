import { useState } from "react";

function useModalStarship() {
  const [isShowingModalStarship, setIsShowingModalStarship] = useState(false);

  function toggleModalStarship() {
    setIsShowingModalStarship(!isShowingModalStarship);
  }

  return {
    isShowingModalStarship,
    toggleModalStarship,
  };
}

export default useModalStarship;
