import express from "express";
import {
    createProjectHandler,
    getAllProjectsHandler,
    getProjectHandler,
    updateProjectHandler,
    deleteProjectHandler,
} from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { itemsHealthCheck } from "../controllers/userController";

const router: express.Router = express.Router();


// Health check endpoint
router.get("/health", itemsHealthCheck);

router.get("/projects", 
    authenticate, 
    isAuthorized({ hasRole: ["admin", "lead", "developer"] }), 
    getAllProjectsHandler
);

router.get(
    "/projects/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead", "developer"] }),
    getProjectHandler
);

router.post(
    "/projects",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead"] }),
    createProjectHandler
);

router.put(
    "/projects/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead"] }),
    updateProjectHandler
);

router.delete(
    "/projects/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    deleteProjectHandler
);

export default router;

