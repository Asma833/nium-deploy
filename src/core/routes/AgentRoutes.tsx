// import React from 'react';
// import { Route, Routes, useParams } from 'react-router-dom';

// const AgentDetail: React.FC = () => {
//   const { agentId } = useParams();
//   return <div>Agent Details for ID: {agentId}</div>;
// };

// export const AgentRoutes = () => {
//   return (
//     <Routes>
//       <Route
//         path=":agentId"
//         element={
//           <PrivateRoute
//             element={<AgentDetail />}
//             action="read"
//             subject="Agent"
//           />
//         }
//       />
//       <Route
//         path=":agentId/transactions"
//         element={
//           <PrivateRoute
//             element={<TransactionList />}
//             action="read"
//             subject="Transaction"
//           />
//         }
//       />
//     </Routes>
//   );
// };
