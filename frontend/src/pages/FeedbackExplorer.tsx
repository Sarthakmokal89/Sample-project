import React, { useState, useMemo, useEffect } from 'react';
import FeedbackTable from '../components/FeedbackTable';
import { ExportIcon, SearchIcon, AlertsIcon } from '../components/Icons';
import { Feedback, Sentiment, Urgency, Platform } from '../types';
import { fetchFeedback } from '../utils/feedbackService';
import LoadingSpinner from '../components/LoadingSpinner';

const FilterDropdown: React.FC<{ label: string; options: string[]; selected: string; onChange: (value: string) => void;}> = ({label, options, selected, onChange}) => (
    <div className="relative">
        <select
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-violet-800/50 border border-violet-700 rounded-lg py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
            <option value="">All {label}</option>
            {options.map(opt => <option key={opt} value={opt} className="capitalize bg-violet-900">{opt}</option>)}
        </select>
    </div>
);


const FeedbackExplorer: React.FC = () => {
    const [allFeedback, setAllFeedback] = useState<Feedback[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [sentimentFilter, setSentimentFilter] = useState('');
    const [urgencyFilter, setUrgencyFilter] = useState('');
    const [platformFilter, setPlatformFilter] = useState('');

    useEffect(() => {
        const loadFeedback = async () => {
            try {
                setIsLoading(true);
                const data = await fetchFeedback();
                setAllFeedback(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to load feedback data.');
            } finally {
                setIsLoading(false);
            }
        };
        loadFeedback();
    }, []);

    const filteredData = useMemo(() => {
        return allFeedback.filter(item => {
            const searchMatch = item.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                item.message.body.toLowerCase().includes(searchTerm.toLowerCase());
            const sentimentMatch = sentimentFilter ? item.sentiment === sentimentFilter : true;
            const urgencyMatch = urgencyFilter ? item.urgency === urgencyFilter : true;
            const platformMatch = platformFilter ? item.platform === platformFilter : true;
            return searchMatch && sentimentMatch && urgencyMatch && platformMatch;
        });
    }, [searchTerm, sentimentFilter, urgencyFilter, platformFilter, allFeedback]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Feedback Explorer</h1>
          <p className="text-gray-400 text-sm mt-1">Analyze and filter customer feedback</p>
        </div>
        <button className="flex items-center bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-violet-700 transition-colors">
            <ExportIcon className="w-4 h-4 mr-2" />
            Export Results
        </button>
      </div>

      <div className="bg-violet-900 border border-violet-800/80 p-4 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative lg:col-span-1">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search feedback, username..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-violet-800/50 border border-violet-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
            </div>
            <FilterDropdown label="Sentiments" options={Object.values(Sentiment)} selected={sentimentFilter} onChange={setSentimentFilter}/>
            <FilterDropdown label="Urgencies" options={Object.values(Urgency)} selected={urgencyFilter} onChange={setUrgencyFilter}/>
            <FilterDropdown label="Platforms" options={Object.values(Platform)} selected={platformFilter} onChange={setPlatformFilter}/>
        </div>
         <div className="text-right mt-4 text-sm text-gray-400">
            Showing {filteredData.length} of {allFeedback.length} results
        </div>
      </div>
      
        {isLoading ? (
            <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
            </div>
        ) : error ? (
            <div className="bg-danger-900/50 border border-danger-700 rounded-xl shadow-lg p-12 text-center mt-6">
                <AlertsIcon className="w-12 h-12 text-danger-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white">Error Loading Data</h3>
                <p className="text-danger-300 mt-2">{error}</p>
            </div>
        ) : (
            <FeedbackTable data={filteredData} isExplorer={true}/>
        )}
    </div>
  );
};

export default FeedbackExplorer;