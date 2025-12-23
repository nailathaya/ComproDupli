
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { GapAnalysisReport } from '../../types';

interface GapRadarChartProps {
    data: GapAnalysisReport[];
}

const GapRadarChart: React.FC<GapRadarChartProps> = ({ data }) => {
    // Aggregate competencies
    const competencyMap = new Map<string, number>();
    
    data.forEach(report => {
        report.missingCompetencies.forEach(comp => {
            if(comp !== "Tidak ada kesenjangan kompetensi utama") {
                competencyMap.set(comp, (competencyMap.get(comp) || 0) + 1);
            }
        });
    });

    const chartData = Array.from(competencyMap.entries()).map(([competency, count]) => ({
        subject: competency,
        A: count, // Number of candidates missing this skill
        fullMark: data.length
    }));
    
    if (chartData.length === 0) {
        return <div className="text-center text-gray-500 p-4">Tidak ada data kesenjangan untuk ditampilkan.</div>;
    }

    return (
         <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, data.length]} tick={{ fontSize: 10 }}/>
                    <Radar name="Jumlah Kandidat" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                    <Legend wrapperStyle={{ fontSize: '12px' }}/>
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GapRadarChart;
