import { Router } from "express";
import { loginController } from "../controllers/authControllers.js";
import { getFormController } from "../controllers/formController.js";
import { submitResponseController } from "../controllers/responseController.js";
import { isLoggedIn } from "../middlewares/authMiddleware.js";


const router = Router();

router.post("/login", loginController);

router.get("/get-form/:formId", isLoggedIn, getFormController);

router.patch("/submit-response", isLoggedIn, submitResponseController);


export default router;
