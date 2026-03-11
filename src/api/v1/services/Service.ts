import projects from "../../../data";
import { Project } from "../../v1/../../interface_properties";
import { Timestamp } from "firebase-admin/firestore";


export const createProject = (name: string, status: string):Project => {
    try{
        const newId = projects.length ? projects[projects.length - 1].id + 1 : 1;

        const newProject: Project = {
        id: newId,
        name,
        status,
        createdAt: new Date().toISOString(), 
        };

        projects.push(newProject); 
        return newProject;
    }catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Failed to create event: ${error.message}`);
        } else {
        throw new Error("Failed to create event: Unknown error");
        }
    }
};

export const getAllProjects = () => {
    try{
        const allProjects:projects[] = projects;
        return allProjects;
    }catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Failed to create event: ${error.message}`);
        } else {
        throw new Error("Failed to create event: Unknown error");
        }
    }
};


export const getProject = (id:string): Project => {
    try{
        const project = projects.find(p => p.id === id);
        if (!project) throw new Error("Project not found");
        return project;
    }catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Failed to create event: ${error.message}`);
        } else {
        throw new Error("Failed to create event: Unknown error");
        }
    }
};

/**
 * Update an existing event by ID
 * @param id - Event ID
 * @param data - Partial event data to update
 * @returns Returns the updated Events object, or null if event does not exist
 * @throws Throws an error if update fails
 */
export const updateEvent = async(id:string, data:Partial<Events>): Promise<Events | null> => {
    try{
        const event = await firestoreRepository.getDocumentById("events", id);
        if(!event || !event.exists) return null;
        const eventData = event.data()!;

        const FIXED_TIME = new Date("2025-12-18T21:24:50.029Z");

        const updateEventData: Events = {
            id: event.id,
            name: data.name ?? eventData.name,
            date: data.date ?? eventData.date,
            capacity: data.capacity ?? eventData.capacity,
            registrationCount: data.registrationCount ?? eventData.registrationCount,
            status: data.status ?? eventData.status,
            category: data.category ?? eventData.category,
            createdAt: FIXED_TIME,
            updatedAt: FIXED_TIME,
        };
        await firestoreRepository.updateDocument<Events>("events", id, updateEventData);
        return updateEventData;
    }catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Failed to create event: ${error.message}`);
        } else {
        throw new Error("Failed to create event: Unknown error");
        }
    }
};

/**
 * Delete an event by ID
 * @param id - Event ID
 * @returns Returns the deleted Events object, or null if event does not exist
 * @throws Throws an error if deletion fails
 */
export const deleteEvent = async(id:string):Promise<Events | null> => {
    try{
        const doc = await firestoreRepository.getDocumentById("events", id);
        if(!doc || !doc.exists ) return null;
        const data = doc.data()!;
        const deleteData: Events = {
            id: doc.id,
            name: data.name,
            date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
            capacity: data.capacity,
            registrationCount: data.registrationCount,
            status: data.status,
            category: data.category,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt,
        };
        await firestoreRepository.deleteDocument("events", id);
        return deleteData;
    }catch (error: unknown) {
        if (error instanceof Error) {
        throw new Error(`Failed to create event: ${error.message}`);
        } else {
        throw new Error("Failed to create event: Unknown error");
        }
    }
};