import { Request, Response, NextFunction } from "express";
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

export const createProjectHandler = (req: Request, res: Response) => {
  try {
    const { name, status } = req.body;

    if (!name || !status) {
      return res.status(400).json({ message: "Missing name or status" });
    }

    const newProject = itemService.createProject(name, status);

    return res.status(201).json(newProject);

  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ message: `Failed to create project: ${error.message}` });
    }
    return res.status(500).json({ message: "Failed to create project: Unknown error" });
  }
};

export const getProjectHandler = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const project = itemService.getProject(id);

    return res.status(200).json(project);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unknown error" });
  }
};

export const updateProjectHandler = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, status } = req.body;

    const updatedProject = itemService.updateProject(id, name, status);

    return res.status(200).json(updatedProject);
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Project not found") {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unknown error" });
  }
};

export const deleteProjectHandler = (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const deletedProject = itemService.deleteProject(id);

    return res.status(200).json({
      message: "Project deleted successfully",
      project: deletedProject,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "Project not found") {
        return res.status(404).json({ message: error.message });
      }
      return res.status(500).json({ message: error.message });
    }
    return res.status(500).json({ message: "Unknown error" });
  }
};


