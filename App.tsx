import React, { useState } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import Spinner from './components/Spinner';
import ErrorMessage from './components/ErrorMessage';
import { getConvergenceAssessment } from './services/geminiService';
import { Assessment, SimulationSetup, TURBULENCE_MODELS } from './types';

const initialSetup: SimulationSetup = {
    geometry: '',
    velocity: '',
    density: '998.2', // default to water density kg/m^3
    turbulenceModel: TURBULENCE_MODELS[1], // k-omega SST is a common, robust choice
    meshDetails: '',
};

function App() {
    const [setup, setSetup] = useState<SimulationSetup>(initialSetup);
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSetupChange = (field: keyof SimulationSetup, value: string) => {
        setSetup(prev => ({ ...prev, [field]: value }));
    };

    const handleAnalyzeClick = async () => {
        if (!setup.geometry.trim() || !setup.velocity.trim()) return;

        setIsLoading(true);
        setError(null);
        setAssessment(null);

        const prompt = `
Analyze the convergence likelihood for the following CFD setup:
- Geometry: ${setup.geometry}
- Characteristic Velocity: ${setup.velocity} m/s
- Fluid Density: ${setup.density} kg/m^3
- Turbulence Model: ${setup.turbulenceModel}
- Mesh Details: ${setup.meshDetails || 'Not specified.'}
- Other notes: Please consider potential issues related to boundary conditions, numerical schemes, and mesh quality, even if not fully specified.
`;

        try {
            const result = await getConvergenceAssessment(prompt.trim());
            setAssessment(result);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
            <div className="container mx-auto px-4 py-8">
                <Header />
                <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 h-[70vh] min-h-[600px]">
                    <InputSection
                        setup={setup}
                        onSetupChange={handleSetupChange}
                        onSubmit={handleAnalyzeClick}
                        isLoading={isLoading}
                    />
                    <div className="relative h-full">
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/30 rounded-xl z-10">
                                <Spinner />
                            </div>
                        )}
                         {error && !isLoading && (
                            <div className="h-full flex items-center justify-center p-4">
                               <ErrorMessage message={error} />
                            </div>
                        )}
                        {!isLoading && !error && (
                             <OutputSection assessment={assessment} />
                        )}
                    </div>
                </main>
                 <footer className="text-center text-slate-500 mt-12 text-sm">
                    <p>Powered by Google Gemini. For educational and advisory purposes only.</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
