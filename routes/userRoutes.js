import { Router } from "express";
import { loginController, signUpController } from "../controllers/adminControllers.js";
import { getFormController } from "../controllers/formController.js";
import { submitResponseController } from "../controllers/responseController.js";


const router = Router();

router.post("/signup",signUpController);

router.post("/login",loginController);

router.get("/get-form/:formId", getFormController);

router.post("submit-response",submitResponseController);


export default router;
