
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center py-8 px-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2">
                CFD Convergence Advisor
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Paste your simulation setup below to get an AI-powered analysis of its convergence potential.
            </p>
        </header>
    );
};

export default Header;
