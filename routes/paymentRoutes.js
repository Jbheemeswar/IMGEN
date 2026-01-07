import express from "express";
import multer from "multer";
import userAuth from "../middlewares/auth.js";
import { submitPaymentProof, approvePayment } from "../controllers/paymentController.js";

const router = express.Router();

// file upload
const upload = multer({ dest:"uploads/" });

router.post("/submit-payment", userAuth, upload.single("screenshot"), submitPaymentProof);

// ADMIN ONLY (later protect)
router.post("/approve-payment", approvePayment);

export default router;
