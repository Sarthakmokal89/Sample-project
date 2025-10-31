
import React from 'react';
// Fix: Changed alias imports to relative paths.
import { Feedback, Sentiment, Urgency } from '../types';
import { MoreVerticalIcon } from './Icons';

interface FeedbackTableProps {
  data: Feedback[];
  title?: string;
  isExplorer?: boolean;
}

const sentimentClasses: Record<Sentiment, string> = {
  [Sentiment.Positive]: 'bg-green-500/10 text-green-400 ring-1 ring-inset ring-green-500/20',
  [Sentiment.Neutral]: 'bg-stone-500/10 text-stone-400 ring-1 ring-inset ring-stone-500/20',
  [Sentiment.Negative]: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20',
};

const urgencyClasses: Record<Urgency, string> = {
  [Urgency.High]: 'bg-red-500/10 text-red-400 ring-1 ring-inset ring-red-500/20',
  [Urgency.Medium]: 'bg-amber-500/10 text-amber-400 ring-1 ring-inset ring-amber-500/20',
  [Urgency.Low]: 'bg-stone-500/10 text-stone-400 ring-1 ring-inset ring-stone-500/20',
};

const Badge: React.FC<{ children: React.ReactNode; className: string }> = ({ children, className }) => (
  <span className={`px-2 py-1 text-xs font-medium rounded-md capitalize inline-block ${className}`}>
    {children}
  </span>
);

const FeedbackTable: React.FC<FeedbackTableProps> = ({ data, title, isExplorer = false }) => {
  return (
    <div className={`bg-violet-900 border border-violet-800/80 rounded-xl shadow-lg ${isExplorer ? 'p-0' : 'p-5'}`}>
      {title && <h3 className="text-lg font-semibold text-white mb-4 px-5 pt-5">{title}</h3>}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-violet-900/50">
            <tr>
              <th scope="col" className="p-4">Username</th>
              <th scope="col" className="p-4">Message</th>
              <th scope="col" className="p-4">Sentiment</th>
              <th scope="col" className="p-4">Urgency</th>
              <th scope="col" className="p-4">Platform</th>
              <th scope="col" className="p-4">Date</th>
              <th scope="col" className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="border-b border-violet-800/80 hover:bg-violet-800/40">
                  <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center">
                          <img className="w-8 h-8 rounded-full" src={item.avatar} alt={item.username} />
                          <div className="ml-3">
                              <div className="text-sm font-semibold text-white max-w-[200px] truncate" title={item.username}>{item.username}</div>
                              <div className="text-xs text-gray-400 max-w-[200px] truncate" title={item.email}>{item.email}</div>
                          </div>
                      </div>
                  </td>
                  <td className="p-4 max-w-sm">
                      <p className="font-medium text-gray-200 truncate">{item.message.subject}</p>
                      <p className="text-xs text-gray-400 truncate">{item.message.body}</p>
                  </td>
                  <td className="p-4"><Badge className={sentimentClasses[item.sentiment]}>{item.sentiment}</Badge></td>
                  <td className="p-4"><Badge className={urgencyClasses[item.urgency]}>{item.urgency}</Badge></td>
                  <td className="p-4 capitalize">{item.platform}</td>
                  <td className="p-4">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <button className="p-1.5 rounded-md hover:bg-violet-700">
                      <MoreVerticalIcon className="w-5 h-5"/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-8 text-gray-400">
                  No feedback data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeedbackTable;