export type IconGlId =
  | "pie_01"
  | "pie_02"
  | "pie_03"
  | "star"
  | "swirl";

export type IconGlKey =
  | "Pie_01"
  | "Pie_02"
  | "Pie_03"
  | "Star"
  | "Swirl";

export enum IconGl {
  Pie_01 = "pie_01",
  Pie_02 = "pie_02",
  Pie_03 = "pie_03",
  Star = "star",
  Swirl = "swirl",
}

export const ICON_GL_CODEPOINTS: { [key in IconGl]: string } = {
  [IconGl.Pie_01]: "61697",
  [IconGl.Pie_02]: "61698",
  [IconGl.Pie_03]: "61699",
  [IconGl.Star]: "61700",
  [IconGl.Swirl]: "61701",
};
