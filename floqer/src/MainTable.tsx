import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import LineGraph from './LineGraph';
import SecondaryTable from './SecondaryTable';

interface DataType {
  year: number;
  totalJobs: number;
  averageSalary: number;
}

interface JobData {
  jobTitle: string;
  jobCount: number;
}

interface JobDataByYear {
  [year: number]: JobData[];
}

const processData = (data: Array<{ work_year: number; salary_in_usd: number; job_title: string }>) => {
  const summary = data.reduce((acc, item) => {
    const { work_year, salary_in_usd } = item;
    if (!acc[work_year]) {
      acc[work_year] = { year: work_year, totalJobs: 0, totalSalary: 0 };
    }
    acc[work_year].totalJobs += 1;
    acc[work_year].totalSalary += salary_in_usd;
    return acc;
  }, {} as { [key: number]: { year: number; totalJobs: number; totalSalary: number } });

  const jobSummary = data.reduce((acc, item) => {
    const { work_year, job_title } = item;
    if (!acc[work_year]) {
      acc[work_year] = {};
    }
    if (!acc[work_year][job_title]) {
      acc[work_year][job_title] = 0;
    }
    acc[work_year][job_title] += 1;
    return acc;
  }, {} as { [key: number]: { [job_title: string]: number } });

  const formattedJobData: JobDataByYear = {};
  for (const year in jobSummary) {
    formattedJobData[year] = Object.entries(jobSummary[year]).map(([jobTitle, jobCount]) => ({
      jobTitle,
      jobCount,
    }));
  }

  return {
    yearlyData: Object.values(summary).map((item) => ({
      year: item.year,
      totalJobs: item.totalJobs,
      averageSalary: item.totalSalary / item.totalJobs,
    })),
    jobData: formattedJobData,
  };
};

const MainTable: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [jobData, setJobData] = useState<JobDataByYear>({});

  useEffect(() => {
    fetch('./data.json')
      .then((response) => response.json())
      .then((data) => {
        const { yearlyData, jobData } = processData(data);
        setData(yearlyData);
        setJobData(jobData);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleRowClick = (record: DataType) => {
    setSelectedYear(record.year);
  };

  const getJobDataForYear = (year: number) => {
    return jobData[year] || [];
  };

  const columns = [
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      sorter: (a: { year: number }, b: { year: number }) => a.year - b.year,
    },
    {
      title: 'Total Jobs',
      dataIndex: 'totalJobs',
      key: 'totalJobs',
      sorter: (a: { totalJobs: number }, b: { totalJobs: number }) => a.totalJobs - b.totalJobs,
    },
    {
      title: 'Average Salary (USD)',
      dataIndex: 'averageSalary',
      key: 'averageSalary',
      sorter: (a: { averageSalary: number }, b: { averageSalary: number }) =>
        a.averageSalary - b.averageSalary,
    },
  ];

  return (
    <>
      <h1>Yearly Job Data</h1>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="year"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <LineGraph data={data} />
      {selectedYear && (
        <SecondaryTable data={getJobDataForYear(selectedYear)} />
      )}
    </>
  );
};

export default MainTable;
