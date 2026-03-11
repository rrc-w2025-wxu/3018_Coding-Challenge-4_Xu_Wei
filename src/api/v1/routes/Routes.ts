import express from "express";
import {
    createPostHandler,
    getAllProjectsHandler,
    getPostByIdHandler,
    updatePostHandler,
    deletePostHandler,
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
    updatePostHandler
);

router.post(
    "/projects",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead"] }),
    updatePostHandler
);

router.put(
    "/projects/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "lead"] }),
    updatePostHandler
);

router.delete(
    "/projects/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    deletePostHandler
);

export default router;

