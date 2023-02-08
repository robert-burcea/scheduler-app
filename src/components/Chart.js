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
      <p className="text-lg flex flex-col items-center m-5">{percentage > 0 ? percentage.toFixed(1) : '0'}% of target reached</p>
      <p className="text-lg flex items-center m-5 justify-center">
        <span className="text-green-500">{hoursSpent > 0 ? (hoursSpent.toFixed(1)) : '0'}</span> / <span className="text-red-500">{targetHours}</span>
        </p>
      <Doughnut data={data}/>
    </div>
  );
};

export default Chart;
