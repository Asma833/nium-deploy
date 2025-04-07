import { z } from 'zod';

export const agentSchema = z.object({
  agentEonCode: z.string().min(1, 'Agent EON Code is required'),
  primaryAgentName: z.string().min(1, 'Primary Agent Name is required'),
  primaryAgentEmail: z.string().email('Invalid email'),
  branchUserName: z.string().min(1, 'Branch User Name is required'),
  branchUserEmail: z.string().email('Invalid email'),
  branchName: z.string().min(1, 'Branch Name is required'),
  branchCity: z.string().min(1, 'Branch City is required'),
  branchState: z.string().min(1, 'Branch State is required'),
  branchRegion: z.string().min(1, 'Branch Region is required'),
  niumRmUsername: z.string().min(1, 'NIUM RM Username is required'),
  niumRmBranchName: z.string().min(1, 'NIUM RM Branch Name is required'),
  niumRmBranchRegion: z.string().min(1, 'NIUM RM Branch Region is required'),
  role: z.enum(['maker', 'checker']),
});
