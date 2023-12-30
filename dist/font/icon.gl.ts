export type IconGlId =
  | "admin"
  | "api"
  | "home";

export type IconGlKey =
  | "Admin"
  | "Api"
  | "Home";

export enum IconGl {
  Admin = "admin",
  Api = "api",
  Home = "home",
}

export const ICON_GL_CODEPOINTS: { [key in IconGl]: string } = {
  [IconGl.Admin]: "61697",
  [IconGl.Api]: "61698",
  [IconGl.Home]: "61699",
};
