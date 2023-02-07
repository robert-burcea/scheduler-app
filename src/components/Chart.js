import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const Chart = ({ hoursSpent, targetHours }) => {
  const percentage = (hoursSpent / targetHours) * 100;

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
    ]
  };

  return (
    <div>
      <Doughnut data={data} />
      <p>{percentage.toFixed(2)}% of target reached</p>
    </div>
  );
};

export default Chart;
