// src/features/admin-portal/agent-report/hooks/useAgentReports.ts
import { useState, useEffect } from 'react';
import { fetchAgentReports } from '../api/agentReportApi';
import { AgentReport } from '../api/reportTypes';

const useAgentReports = () => {
  const [reports, setReports] = useState<AgentReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchAgentReports();
        setReports(data);
      } catch (err) {
        setError('Failed to load reports.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  return { reports, loading, error };
};

export default useAgentReports;
