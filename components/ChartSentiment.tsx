
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
// Fix: Changed alias import to a relative path.
import { Feedback, Sentiment } from '../types';

interface ChartSentimentProps {
  data: Feedback[];
}

const sentimentColors: { [key in Sentiment]: string } = {
  [Sentiment.Positive]: '#22c55e',
  [Sentiment.Neutral]: '#a8a29e',
  [Sentiment.Negative]: '#ef4444',
};

const ChartSentiment: React.FC<ChartSentimentProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const counts = {
      [Sentiment.Positive]: 0,
      [Sentiment.Neutral]: 0,
      [Sentiment.Negative]: 0,
    };
    data.forEach(item => {
      counts[item.sentiment]++;
    });
    // Fix: Accessed properties using bracket notation with enum values instead of incorrect dot notation.
    return [
      { name: 'Positive', value: counts[Sentiment.Positive] },
      { name: 'Negative', value: counts[Sentiment.Negative] },
      { name: 'Neutral', value: counts[Sentiment.Neutral] },
    ];
  }, [data]);
  
  const total = useMemo(() => chartData.reduce((acc, curr) => acc + curr.value, 0), [chartData]);


  return (
    <div className="bg-violet-900 border border-violet-800/80 p-5 rounded-xl shadow-lg h-full flex flex-col">
      <h3 className="text-base font-semibold text-white mb-4">Sentiment Distribution</h3>
      <div className="flex-grow w-full h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
                cursor={{fill: 'transparent'}}
                contentStyle={{
                    backgroundColor: 'rgba(46, 16, 101, 0.8)',
                    borderColor: '#6d28d9',
                    borderRadius: '0.5rem',
                    color: '#fff'
                }}
            />
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={sentimentColors[entry.name.toLowerCase() as Sentiment]} />
              ))}
            </Pie>
             <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                formatter={(value, entry) => <span className="text-gray-300 ml-2">{value}</span>}
             />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
                <span className="text-3xl font-bold text-white">{total}</span>
                <p className="text-xs text-gray-400">Total</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSentiment;