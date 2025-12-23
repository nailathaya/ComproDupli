
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { MatchResult } from '../../types';

interface FitScoreChartProps {
    data: MatchResult[];
}

const FitScoreChart: React.FC<FitScoreChartProps> = ({ data }) => {
    const chartData = data.map(result => ({
        name: result.candidate.user.name.split(' ')[0],
        fitScore: result.fitScore
    }));
    
    const getColor = (score: number) => {
        if (score > 80) return '#16a34a'; // green
        if (score > 60) return '#f97316'; // orange
        return '#ef4444'; // red
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow h-full">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Visualisasi Fit Score</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <YAxis type="category" dataKey="name" width={60} tick={{ fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: 'rgba(239, 246, 255, 0.7)' }}
                            formatter={(value: number) => [`${value}%`, 'Fit Score']}
                        />
                        <Bar dataKey="fitScore" barSize={20}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry.fitScore)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default FitScoreChart;
