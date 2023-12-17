import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const configPaths = {

  // Source files
  src: path.resolve(__dirname, "/src"),

  // Production build files
  build: path.resolve(__dirname, "/dist"),

  // Static files that get copied to build folder
  public: path.resolve(__dirname, "/public"),

};


export default configPaths
