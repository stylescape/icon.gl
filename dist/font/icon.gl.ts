export type IconGlId =
  | "admin"
  | "api"
  | "home";

export type IconGlKey =
  | "Admin"
  | "Api"
  | "Home";

export enum icon_gl {
  Admin = "admin",
  Api = "api",
  Home = "home",
}

export const MY_CODEPOINTS: { [key in icon_gl]: string } = {
  [icon_gl.Admin]: "61697",
  [icon_gl.Api]: "61698",
  [icon_gl.Home]: "61699",
};
