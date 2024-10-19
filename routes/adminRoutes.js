import { Router } from "express";
import {
  createFormController,
  deleteFormController,
  getAllFormsController,
} from "../controllers/formController.js";
import { getResponsesController } from "../controllers/responseController.js";
import { isAuthorized, isLoggedIn } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/create-form", isLoggedIn, isAuthorized, createFormController);

router.get("/get-forms", isLoggedIn, isAuthorized, getAllFormsController);

//send formId in req.body
router.delete("/delete-form", isLoggedIn, isAuthorized, deleteFormController);

//saves the responses to a excel file
router.get("/get-responses/:formId", isLoggedIn, isAuthorized, getResponsesController);

export default router;
