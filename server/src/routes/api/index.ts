import express from "express";
const apiRoutes = express.Router();
import { userRoutes } from "./user-routes.js";

apiRoutes.use("/users", userRoutes);

export { apiRoutes };
