import useAgentReports from '../hooks/useAgentReports';

const AgentReportListPage = () => {
  const { reports, loading, error } = useAgentReports();

  if (loading) return <div>Loading agent reports...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Agent Reports</h1>
      <ul>
        {reports.map(report => (
          <li key={report.id}>
            <h2>{report.title}</h2>
            <p>{report.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AgentReportListPage;
