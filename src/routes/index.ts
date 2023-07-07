import express from "express";
import * as TalentsControllers from "../controllers/talents";

const mainRouter = express.Router();

mainRouter.get("/talents/query", TalentsControllers.queryTalents);
mainRouter.get("/talents", TalentsControllers.getTalents);
mainRouter.get("/talents/search", TalentsControllers.getTalent);
mainRouter.post("/talents", TalentsControllers.createTalent);
mainRouter.put("/talents", TalentsControllers.updateTalent);
mainRouter.delete("/talents", TalentsControllers.deleteTalent);

export default mainRouter;
