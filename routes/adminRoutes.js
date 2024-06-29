import { Router } from "express";
import {
  createFormController,
  deleteFormController,
  getAllFormsController,
} from "../controllers/formController.js";
import { getResponsesController } from "../controllers/responseController.js";

const router = Router();

router.post("/create-form", createFormController);

router.get("/get-forms", getAllFormsController);

//send formId in req.body
router.delete("/delete-form", deleteFormController);

//saves the responses to a excel file
router.get("/get-responses/:formId",getResponsesController);

export default router;
