/**
 * Represents the response structure for the Health Check API.
 */
export interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}

export interface Project {
  id: number;        
  name: string;      
  status: string;    
  createdAt: string; 
}
