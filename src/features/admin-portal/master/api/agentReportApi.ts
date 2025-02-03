// src/features/admin-portal/agent-report/api/agentReportApi.ts

import axios from 'axios';
import { AgentReport, NewReport } from './reportTypes';

const BASE_URL = '/api/admin/agent-reports';

/**
 * Fetch all agent reports.
 */
export const fetchAgentReports = async (): Promise<AgentReport[]> => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

/**
 * Fetch a single agent report by ID.
 * @param reportId - The unique identifier for the report.
 */
export const fetchAgentReportById = async (reportId: string): Promise<AgentReport> => {
  const response = await axios.get(`${BASE_URL}/${reportId}`);
  return response.data;
};

/**
 * Create a new agent report.
 * @param reportData - The data for the new report.
 */
export const createAgentReport = async (reportData: NewReport): Promise<AgentReport> => {
  const response = await axios.post(BASE_URL, reportData);
  return response.data;
};

/**
 * Update an existing agent report.
 * @param reportId - The report's unique identifier.
 * @param reportData - The updated report data.
 */
export const updateAgentReport = async (reportId: string, reportData: Partial<AgentReport>): Promise<AgentReport> => {
  const response = await axios.put(`${BASE_URL}/${reportId}`, reportData);
  return response.data;
};

/**
 * Delete an agent report by its ID.
 * @param reportId - The unique identifier for the report.
 */
export const deleteAgentReport = async (reportId: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/${reportId}`);
};
