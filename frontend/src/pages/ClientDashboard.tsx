import React, { useMemo, useState, useEffect } from 'react';
import CardStat from '../components/CardStat';
import ChartSentiment from '../components/ChartSentiment';
import { FeedbackIcon, AlertsIcon, ExportIcon } from '../components/Icons';
import { Sentiment, Urgency, Feedback } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchFeedback } from '../utils/feedbackService';
import LoadingSpinner from '../components/LoadingSpinner';


const ChartTrends: React.FC<{data: Feedback[]}> = ({data}) => {
    const trendData = useMemo(() => {
        const dateMap = new Map<string, { Positive: number, Negative: number, Neutral: number }>();
        data.forEach(item => {
            const date = new Date(item.date).toLocaleDateString('en-CA');
            if (!dateMap.has(date)) {
                dateMap.set(date, { Positive: 0, Negative: 0, Neutral: 0 });
            }
            const counts = dateMap.get(date)!;
            if (item.sentiment === Sentiment.Positive) counts.Positive++;
            if (item.sentiment === Sentiment.Negative) counts.Negative++;
            if (item.sentiment === Sentiment.Neutral) counts.Neutral++;
        });
        return Array.from(dateMap.entries())
            .map(([date, counts]) => ({ date, ...counts }))
            .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data]);

    return (
        <div className="bg-violet-900 border border-violet-800/80 p-5 rounded-xl shadow-lg h-[400px] flex flex-col">
            <h3 className="text-base font-semibold text-white mb-4">Sentiment Trends Over Time</h3>
            <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" />
                    <XAxis dataKey="date" tick={{ fill: '#a78bfa' }} fontSize={12} />
                    <YAxis tick={{ fill: '#a78bfa' }} fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(46, 16, 101, 0.8)', borderColor: '#6d28d9', color: '#fff' }} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Line type="monotone" dataKey="Positive" stroke="#22c55e" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}}/>
                    <Line type="monotone" dataKey="Negative" stroke="#ef4444" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}}/>
                    <Line type="monotone" dataKey="Neutral" stroke="#a8a29e" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}}/>
                </LineChart>
            </ResponsiveContainer>
            </div>
        </div>
    );
};

const ChartPlatform: React.FC<{data: Feedback[]}> = ({data}) => {
     const platformData = useMemo(() => {
        const platformMap = new Map<string, { Positive: number, Negative: number, Neutral: number }>();
        data.forEach(item => {
            if (!platformMap.has(item.platform)) {
                platformMap.set(item.platform, { Positive: 0, Negative: 0, Neutral: 0 });
            }
            const counts = platformMap.get(item.platform)!;
            if (item.sentiment === Sentiment.Positive) counts.Positive++;
            if (item.sentiment === Sentiment.Negative) counts.Negative++;
            if (item.sentiment === Sentiment.Neutral) counts.Neutral++;
        });
        return Array.from(platformMap.entries()).map(([name, counts]) => ({ name, ...counts }));
    }, [data]);

    return (
         <div className="bg-violet-900 border border-violet-800/80 p-5 rounded-xl shadow-lg h-[300px] flex flex-col">
            <h3 className="text-base font-semibold text-white mb-4">Platform Comparison</h3>
             <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#4c1d95" />
                    <XAxis type="number" tick={{ fill: '#a78bfa' }} fontSize={12} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#a78bfa' }} fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(46, 16, 101, 0.8)', borderColor: '#6d28d9', color: '#fff' }} />
                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                    <Bar dataKey="Positive" stackId="a" fill="#22c55e" />
                    <Bar dataKey="Negative" stackId="a" fill="#ef4444" />
                    <Bar dataKey="Neutral" stackId="a" fill="#a8a29e" />
                </BarChart>
            </ResponsiveContainer>
             </div>
        </div>
    );
};

const UrgencyList: React.FC<{data: Feedback[]}> = ({data}) => {
    const highUrgencyItems = data.filter(item => item.urgency === Urgency.High).slice(0, 3);
    const urgencyClasses = 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20 px-2 py-1 text-xs font-medium rounded-md capitalize inline-block';

    return (
        <div className="bg-violet-900 border border-violet-800/80 p-5 rounded-xl shadow-lg h-full">
            <h3 className="text-base font-semibold text-white mb-4">High Urgency Complaints</h3>
            <div className="space-y-4">
                {highUrgencyItems.length > 0 ? highUrgencyItems.map(item => (
                    <div key={item.id}>
                        <div className="flex items-center justify-between text-sm">
                            <p className="font-medium text-gray-300 capitalize truncate">{item.username} - <span className="text-gray-400 font-normal">{item.message.subject}</span></p>
                            <span className={urgencyClasses}>{item.urgency}</span>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{item.message.body}</p>
                        <p className="text-xs text-violet-400 mt-1">{new Date(item.date).toLocaleString()}</p>
                    </div>
                )) : (
                    <p className="text-sm text-gray-400 text-center py-4">No high urgency items found.</p>
                )}
            </div>
        </div>
    );
}

const ClientDashboard: React.FC = () => {
    const [feedbackData, setFeedbackData] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadFeedback = async () => {
            try {
                setIsLoading(true);
                const data = await fetchFeedback();
                setFeedbackData(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboard data.');
            } finally {
                setIsLoading(false);
            }
        };
        loadFeedback();
    }, []);

    const totalFeedback = feedbackData.length;
    const negativeSentiment = feedbackData.filter(f => f.sentiment === Sentiment.Negative).length;
    const positiveSentiment = feedbackData.filter(f => f.sentiment === Sentiment.Positive).length;
    const highUrgency = feedbackData.filter(f => f.urgency === Urgency.High).length;
    const hasData = totalFeedback > 0;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <LoadingSpinner />
                <p className="ml-4 text-white">Fetching latest feedback...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="bg-danger-900/50 border border-danger-700 rounded-xl shadow-lg p-12 text-center mt-6">
                <AlertsIcon className="w-12 h-12 text-danger-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white">Error Loading Data</h3>
                <p className="text-danger-300 mt-2">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 text-sm mt-1">Real-time sentiment analysis overview</p>
                </div>
                <button className="flex items-center bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors">
                    <ExportIcon className="w-4 h-4 mr-2" />
                    Export Data
                </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <CardStat title="Total Feedback" value={totalFeedback.toString()} icon={<FeedbackIcon className="w-5 h-5" />} />
                <CardStat title="Positive Sentiment" value={positiveSentiment.toString()} icon={<FeedbackIcon className="w-5 h-5 text-green-400" />} />
                <CardStat title="Negative Sentiment" value={negativeSentiment.toString()} icon={<FeedbackIcon className="w-5 h-5 text-red-400" />} />
                <CardStat title="High Priority" value={highUrgency.toString()} icon={<AlertsIcon className="w-5 h-5 text-amber-400" />} />
            </div>

            {hasData ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <ChartTrends data={feedbackData} />
                        </div>
                        <div className="lg:col-span-1">
                            <ChartSentiment data={feedbackData} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ChartPlatform data={feedbackData} />
                        <UrgencyList data={feedbackData} />
                    </div>
                </>
            ) : (
                <div className="bg-violet-900 border border-violet-800/80 rounded-xl shadow-lg p-12 text-center mt-6">
                    <FeedbackIcon className="w-12 h-12 text-violet-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white">No Feedback Data Found</h3>
                    <p className="text-gray-400 mt-2">Connect a data source via the settings page to see your dashboard.</p>
                </div>
            )}
        </div>
    );
};

export default ClientDashboard;