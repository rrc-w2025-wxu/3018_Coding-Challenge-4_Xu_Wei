// src/api/v1/services/__tests__/Service.test.ts
import * as service from "../src/api/v1/services/Service";
import { projects as projectsData } from "../src/data";

// 用 Jest 提供的 mock 来测试 Firebase admin
jest.mock("firebase-admin", () => ({
  auth: () => ({
    setCustomUserClaims: jest.fn().mockResolvedValue(undefined),
  }),
}));

describe("Project Service Tests", () => {

  beforeEach(() => {
    // 重置 projects 数组为初始数据
    projectsData.length = 0;
    projectsData.push(
      { id: 1, name: "Website Redesign", status: "active", createdAt: "2025-01-10T10:00:00.000Z" },
      { id: 2, name: "Mobile App v2", status: "planning", createdAt: "2025-01-08T10:00:00.000Z" },
      { id: 3, name: "API Migration", status: "active", createdAt: "2025-01-05T10:00:00.000Z" },
      { id: 4, name: "Security Audit", status: "completed", createdAt: "2025-01-03T10:00:00.000Z" },
    );
  });

  test("getAllProjects should return all projects", () => {
    const allProjects = service.getAllProjects();
    expect(allProjects.length).toBe(4);
    expect(allProjects[0].name).toBe("Website Redesign");
  });

  test("getProject should return a project by id", () => {
    const project = service.getProject(2);
    expect(project.name).toBe("Mobile App v2");
  });

  test("getProject should throw error if not found", () => {
    expect(() => service.getProject(999)).toThrow("Project not found");
  });

  test("createProject should add a new project", () => {
    const newProject = service.createProject("New Project", "active");
    expect(newProject.id).toBe(5);
    expect(projectsData.length).toBe(5);
    expect(projectsData[4].name).toBe("New Project");
  });

  test("updateProject should update name and status", () => {
    const updated = service.updateProject(1, "Updated Name", "completed");
    expect(updated.name).toBe("Updated Name");
    expect(updated.status).toBe("completed");
  });

  test("updateProject should throw if project not found", () => {
    expect(() => service.updateProject(999, "X", "Y")).toThrow("Project not found");
  });

  test("deleteProject should remove project by id", () => {
    const deleted = service.deleteProject(1);
    expect(deleted.name).toBe("Website Redesign");
    expect(projectsData.length).toBe(3);
    expect(projectsData.find(p => p.id === 1)).toBeUndefined();
  });

  test("deleteProject should throw if project not found", () => {
    expect(() => service.deleteProject(999)).toThrow("Project not found");
  });

  test("setCustomClaimsService should call Firebase admin", async () => {
    const admin = require("firebase-admin");
    await service.setCustomClaimsService("test@example.com", "admin");
    expect(admin.auth().setCustomUserClaims).toHaveBeenCalledWith("test@example.com", { role: "admin" });
  });

  test("setCustomClaimsService should throw if missing email or role", async () => {
    await expect(service.setCustomClaimsService("", "admin")).rejects.toThrow("Missing email or role");
    await expect(service.setCustomClaimsService("user@example.com", "")).rejects.toThrow("Missing email or role");
  });
});