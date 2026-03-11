import { Request, Response, NextFunction } from "express";
import { UserRecord } from "firebase-admin/auth";
import { auth } from "../../../config/firebaseConfig";
import { successResponse } from "../models/responseModel";
import { HealthCheckResponse } from "../../../interface_properties";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as itemService from "../services/Service";


/**
 * Check the health status of the service.
 *
 * GET /api/v1/health
 *
 * @param req - Express Request
 * @param res - Express Response
 */
export const itemsHealthCheck = (req: Request, res: Response): void => {
    const healthCheck:HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };
    res.status(HTTP_STATUS.OK).json(healthCheck);
}

export const getAllProjectsHandler = (req: Request,res: Response,next: NextFunction)=> {
    try {
        // Fetch user record from Firebase Authentication
        const allProjects = itemService.getAllProjects();
        res.status(HTTP_STATUS.OK).json(successResponse(allProjects));
    } catch (error) {
        // Pass any errors to the centralized error handler
        next(error);
    }
};



