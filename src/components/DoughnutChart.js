import React from 'react';
import Donut from 'react-donut-chart';

const Chart = ({ hoursSpent, targetHours }) => {
  const percentage = (hoursSpent / targetHours) * 100;
  const data = [{
    label: 'Hours Spent',
    value: hoursSpent,
    color: '#36A2EB'
  },
  {
    label: 'Hours Left',
    value: targetHours - hoursSpent,
    color: '#FFCE56'
  }];

  return (
    <div>
      <p className="text-sm flex flex-col items-center">{percentage.toFixed(2)}% of target reached</p>
      <Donut
        data={data}
        width={190}
        height={190}
        innerRadius={0.5}
        outerRadius={0.9}
        style={{ padding: '30px' }}
      />
    </div>
  );
};

export default Chart;
