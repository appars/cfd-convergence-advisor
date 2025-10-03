
import React from 'react';
import { Assessment, Likelihood } from '../types';

interface OutputSectionProps {
    assessment: Assessment | null;
}

const LikelihoodBadge: React.FC<{ level: Likelihood }> = ({ level }) => {
    const colorClasses = {
        [Likelihood.High]: "bg-green-500/20 text-green-300 border-green-500/30",
        [Likelihood.Medium]: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
        [Likelihood.Low]: "bg-red-500/20 text-red-300 border-red-500/30",
    };
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${colorClasses[level]}`}>
            {level}
        </span>
    );
};

const ChecklistItem: React.FC<{ item: string; index: number }> = ({ item, index }) => {
    const id = `checklist-${index}`;
    return (
        <div className="flex items-start">
            <input
                id={id}
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-gray-500 text-indigo-600 focus:ring-indigo-500 bg-slate-700 cursor-pointer"
            />
            <label htmlFor={id} className="ml-3 text-slate-300 cursor-pointer">{item}</label>
        </div>
    );
};

const OutputSection: React.FC<OutputSectionProps> = ({ assessment }) => {
    if (!assessment) {
        return (
            <div className="flex items-center justify-center h-full bg-slate-800/50 rounded-xl border border-dashed border-slate-700 p-6 shadow-lg text-slate-500">
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium">Awaiting Analysis</h3>
                    <p className="mt-1 text-sm">Your assessment report will appear here.</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="h-full bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-lg overflow-y-auto">
            <h2 className="text-xl font-semibold text-slate-200 mb-6">Assessment Report</h2>

            <div className="space-y-6">
                {/* Overall Likelihood */}
                <div>
                    <h3 className="text-lg font-semibold text-indigo-400 mb-2">Overall Likelihood</h3>
                    <div className="flex items-center space-x-3">
                        <LikelihoodBadge level={assessment.overallLikelihood.level} />
                        <p className="text-slate-300">&mdash; {assessment.overallLikelihood.reason}</p>
                    </div>
                </div>

                {/* Potential Issues */}
                <div>
                    <h3 className="text-lg font-semibold text-indigo-400 mb-2">Potential Issues</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
                        {assessment.potentialIssues.map((issue, index) => <li key={index}>{issue}</li>)}
                    </ul>
                </div>

                {/* Recommendations */}
                <div>
                    <h3 className="text-lg font-semibold text-indigo-400 mb-2">Recommendations</h3>
                    <ul className="list-disc list-inside space-y-2 text-slate-300 pl-2">
                        {assessment.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                    </ul>
                </div>
                
                {/* Quick Checklist */}
                <div>
                    <h3 className="text-lg font-semibold text-indigo-400 mb-3">Quick Checklist</h3>
                    <div className="space-y-3">
                        {assessment.quickChecklist.map((item, index) => <ChecklistItem key={index} item={item} index={index}/>)}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default OutputSection;
