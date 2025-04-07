import React from 'react';
import { Button } from '@/components/ui/button';

export const getAgentBranchUserColumn = () => [
  {
    key: 'requestId',
    id: 'requestId',
    name: 'Request ID',
  },
  {
    key: 'channelPartnerName',
    id: 'channelPartnerName',
    name: 'Channel Partner Name',
  },
  {
    key: 'stage',
    id: 'stage',
    name: 'Stage',
    cell: (value: Date | React.ReactNode) => (
      <span className="whitespace-nowrap">{String(value)}</span>
    ),
  },
  {
    key: 'status',
    id: 'status',
    name: 'Status',
    cell: (value: Date | React.ReactNode) => (
      <span className="whitespace-nowrap">{String(value)}</span>
    ),
  },

  {
    key: 'actions',
    id: 'actions',
    name: 'Actions',
    cell: (_: unknown, row: any) => (
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="text-sm bg-[#ffdea0] border-[#e8b659] px-2 py-1"
        >
          View
        </Button>
      </div>
    ),
  },
];
