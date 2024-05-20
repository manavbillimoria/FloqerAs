import React from 'react';
import { Table } from 'antd';

interface JobData {
  jobTitle: string;
  jobCount: number;
}

const SecondaryTable: React.FC<{ data: JobData[] }> = ({ data }) => {
  const columns = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
    },
    {
      title: 'Number of Jobs',
      dataIndex: 'jobCount',
    },
  ];

  return <Table dataSource={data} columns={columns} rowKey="jobTitle" />;
};

export default SecondaryTable;
