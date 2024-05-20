import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

interface GraphData {
  year: number;
  totalJobs: number;
}

const LineGraph: React.FC<{ data: GraphData[] }> = ({ data }) => {
  return (
    <LineChart width={600} height={300} data={data}>
      <Line type="monotone" dataKey="totalJobs" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="year" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};

export default LineGraph;
