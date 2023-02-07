import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from 'react-chartjs-2';

const Chart = ({ hoursSpent, targetHours }) => {
  const percentage = (hoursSpent / targetHours) * 100;

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    datasets: [{
      data: [hoursSpent, targetHours - hoursSpent],
      backgroundColor: [
        '#36A2EB',
        '#FFCE56'
      ],
      hoverBackgroundColor: [
        '#36A2EB',
        '#FFCE56'
      ]
    }],
    labels: [
      'Hours Spent',
      'Hours Left'
    ],
    options: {
        cutout: 10
    }
  };

  return (
    <div>
      <p className="text-lg flex flex-col items-center m-5">{percentage.toFixed(2)}% of target reached</p>
      <Doughnut data={data}/>
    </div>
  );
};

export default Chart;
