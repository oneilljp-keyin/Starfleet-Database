import d2150 from "../../assets/insignia_2150s_wide.png";
import d2250 from "../../assets/insignia_2250s_sw.png";
import d2260 from "../../assets/insignia_2260s_sw.png";
import d2280 from "../../assets/insignia_2270s_sw.png";
import d2340 from "../../assets/insignia_2340s_sw.png";
import d2370 from "../../assets/insignia_2370s_sw.png";
import d2390 from "../../assets/insignia_2390s_sw.png";
import d2800 from "../../assets/insignia_2800s_wide.png";
import d3100 from "../../assets/insignia_3100s_sw.png";
import ufplogo from "../../assets/ufp_logo.png";

function DefaultImageShip(shipId) {
  if (shipId < 500) {
    return d2150;
  } else if (shipId < 1500) {
    return d2250;
  } else if (shipId < 2000) {
    return d2260;
  } else if (shipId < 40000) {
    return d2280;
  } else if (shipId < 74000) {
    return d2340;
  } else if (shipId < 82000) {
    return d2370;
  } else if (shipId < 150000) {
    return d2390;
  } else if (shipId < 350000) {
    return d2800;
  } else if (shipId < 350000) {
    return d3100;
  } else {
    return ufplogo;
  }
}

export default DefaultImageShip;
