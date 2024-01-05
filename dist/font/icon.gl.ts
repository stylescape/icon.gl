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

export enum icon_gl {
  Pie_01 = "pie_01",
  Pie_02 = "pie_02",
  Pie_03 = "pie_03",
  Star = "star",
  Swirl = "swirl",
}

export const MY_CODEPOINTS: { [key in icon_gl]: string } = {
  [icon_gl.Pie_01]: "61697",
  [icon_gl.Pie_02]: "61698",
  [icon_gl.Pie_03]: "61699",
  [icon_gl.Star]: "61700",
  [icon_gl.Swirl]: "61701",
};
