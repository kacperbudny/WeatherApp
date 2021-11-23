import sun from "../../svg/sun.svg";
import rain from "../../svg/rain.svg";
import snow from "../../svg/snow.svg";
import fog from "../../svg/fog.svg";
import storm from "../../svg/storm.svg";
import cloud from "../../svg/cloud.svg";
import unknown from "../../svg/unknown.svg";

export function getIcon(iconCode: string): string {
  iconCode = iconCode.slice(0, 2);

  switch (iconCode) {
    case "01":
      return sun;
    case "02":
    case "03":
    case "04":
      return cloud;
    case "09":
    case "10":
      return rain;
    case "11":
      return storm;
    case "13":
      return snow;
    case "50":
      return fog;
    default:
      return unknown;
  }
}
