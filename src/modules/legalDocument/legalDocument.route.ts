import { Router } from "express";
import auth from "../../middleware/auth";
import requestValidator from "../../middleware/request-validator";
import { LegalDocumentValidation } from "./legalDocument.validation";
import { LegalDocumentController } from "./legalDocument.controller";

const router = Router();

router.get("/",auth("COMMON"), requestValidator(LegalDocumentValidation.getLegalDocumentsSchema), LegalDocumentController.getLegalDocuments);

router.patch("/:id",auth("ADMIN"), requestValidator(LegalDocumentValidation.updateSchema), LegalDocumentController.updateLegalDocument);

export const LegalDocumentRoutes = router;