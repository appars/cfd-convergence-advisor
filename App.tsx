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
    viscosity: '0.001002', // default to water viscosity Pa.s
    characteristicLength: '',
    turbulenceModel: TURBULENCE_MODELS[1], // k-omega SST is a common, robust choice
    customTurbulenceModel: '',
    meshDetails: '',
    yPlus: '',
    numerics: '',
    domainExtents: '',
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
        if (!setup.geometry.trim() || !setup.velocity.trim() || !setup.characteristicLength.trim()) return;
        if (setup.turbulenceModel === 'Other' && !setup.customTurbulenceModel?.trim()) return;

        setIsLoading(true);
        setError(null);
        setAssessment(null);

        // Reynolds number calculation
        let reynoldsNumberText = 'Not calculated (missing inputs).';
        const rho = parseFloat(setup.density);
        const V = parseFloat(setup.velocity);
        const L = parseFloat(setup.characteristicLength);
        const mu = parseFloat(setup.viscosity);

        if (!isNaN(rho) && !isNaN(V) && !isNaN(L) && !isNaN(mu) && mu !== 0) {
            const Re = (rho * V * L) / mu;
            reynoldsNumberText = `~${Re.toExponential(2)}`;
        }

        const turbulenceModelText = setup.turbulenceModel === 'Other' 
            ? setup.customTurbulenceModel 
            : setup.turbulenceModel;

        const prompt = `
Analyze the convergence likelihood for the following CFD setup:
- Geometry: ${setup.geometry}
- Characteristic Velocity: ${setup.velocity} m/s
- Characteristic Length: ${setup.characteristicLength} m
- Fluid Density: ${setup.density} kg/m^3
- Viscosity: ${setup.viscosity || 'Not specified.'} Pa·s
- Calculated Reynolds Number: ${reynoldsNumberText}
- Turbulence Model: ${turbulenceModelText}
- Mesh Details: ${setup.meshDetails || 'Not specified.'}
- y+ range: ${setup.yPlus || 'Not specified.'}
- Numerics (scheme, Courant number): ${setup.numerics || 'Not specified.'}
- Domain extents: ${setup.domainExtents || 'Not specified.'}
- Other notes: Please consider potential issues related to boundary conditions, numerical schemes, and mesh quality, even if not fully specified. Pay close attention to the Reynolds number to assess the flow regime.
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
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-xl z-10">
                                <Spinner />
                            </div>
                        )}
                         {!isLoading && error && (
                            <div className="h-full flex items-center justify-center p-4 animate-fade-in-up">
                               <ErrorMessage message={error} />
                            </div>
                        )}
                        {!isLoading && !error && (
                             <div className={assessment ? "h-full animate-fade-in-up" : "h-full"}>
                                <OutputSection assessment={assessment} />
                             </div>
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