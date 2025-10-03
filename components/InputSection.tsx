import React from 'react';
import { SimulationSetup, TURBULENCE_MODELS } from '../types';

interface InputSectionProps {
    setup: SimulationSetup;
    onSetupChange: (field: keyof SimulationSetup, value: string) => void;
    onSubmit: () => void;
    isLoading: boolean;
}

const InputField: React.FC<{ label: string; id: keyof SimulationSetup; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; placeholder?: string; }> = 
({ label, id, type = 'text', value, onChange, required, placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
            {label} {required && <span className="text-red-400">*</span>}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
            required={required}
            step="any"
        />
    </div>
);

const SelectField: React.FC<{ label: string; id: keyof SimulationSetup; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[] }> =
({ label, id, value, onChange, options }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
            {label}
        </label>
        <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
        >
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </div>
);

const TextareaField: React.FC<{ label: string; id: keyof SimulationSetup; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder?: string; rows?: number }> =
({ label, id, value, onChange, placeholder, rows = 4 }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-slate-300 mb-1">
            {label}
        </label>
        <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-slate-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 resize-y"
        />
    </div>
);


const InputSection: React.FC<InputSectionProps> = ({ setup, onSetupChange, onSubmit, isLoading }) => {
    const isSubmitDisabled = isLoading || !setup.geometry.trim() || !setup.velocity.trim();
    
    return (
        <div className="flex flex-col h-full bg-slate-800/50 rounded-xl border border-slate-700 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">
                Simulation Setup
            </h2>
            <div className="flex-grow space-y-4 overflow-y-auto pr-2 -mr-2">
                <InputField 
                    label="Geometry Description"
                    id="geometry"
                    value={setup.geometry}
                    onChange={(e) => onSetupChange('geometry', e.target.value)}
                    required
                    placeholder="e.g., Flow over a cylinder, NACA 0012 airfoil"
                />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField 
                        label="Velocity (m/s)"
                        id="velocity"
                        type="number"
                        value={setup.velocity}
                        onChange={(e) => onSetupChange('velocity', e.target.value)}
                        required
                        placeholder="e.g., 10"
                    />
                     <InputField 
                        label="Density (kg/m³)"
                        id="density"
                        type="number"
                        value={setup.density}
                        onChange={(e) => onSetupChange('density', e.target.value)}
                        placeholder="e.g., 998.2 for water"
                    />
                </div>
                 <SelectField 
                    label="Turbulence Model"
                    id="turbulenceModel"
                    value={setup.turbulenceModel}
                    onChange={(e) => onSetupChange('turbulenceModel', e.target.value)}
                    options={TURBULENCE_MODELS}
                />
                <TextareaField
                    label="Mesh Details"
                    id="meshDetails"
                    value={setup.meshDetails}
                    onChange={(e) => onSetupChange('meshDetails', e.target.value)}
                    placeholder="Describe mesh type, cell count, y+, skewness, etc."
                    rows={5}
                />
            </div>
            <p className="text-xs text-slate-400 mt-4">* Required fields</p>
            <button
                onClick={onSubmit}
                disabled={isSubmitDisabled}
                className="mt-2 w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing...
                    </>
                ) : 'Analyze Convergence'}
            </button>
        </div>
    );
};

export default InputSection;
