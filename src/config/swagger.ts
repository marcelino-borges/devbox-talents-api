import { runSwaggerAutogen } from "./../swagger/index";
import packageJson from "../../package.json";

const updateSwagger = async () => {
  runSwaggerAutogen(packageJson.version, packageJson.description);
};

updateSwagger();
