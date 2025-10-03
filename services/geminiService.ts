
import { GoogleGenAI, Type } from "@google/genai";
import { Assessment } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `You are a world-class CFD (Computational Fluid Dynamics) Convergence Advisor. Your role is to analyze a user's simulation setup and provide a structured assessment of its convergence likelihood. You must be precise, practical, and adhere strictly to the requested output format.

Key principles to follow:
1.  Analyze the provided Reynolds number to determine the flow regime (laminar, transitional, turbulent) and ensure the chosen turbulence model is appropriate.
2.  Assume the flow is incompressible unless explicitly stated otherwise.
3.  If wall functions are mentioned, always include a reminder about maintaining consistent y⁺ targets in your recommendations or checklist.
4.  Be vigilant for common CFD pitfalls: short simulation domains, inconsistent boundary conditions (e.g., mass imbalance), unstable numerical schemes (e.g., high Courant numbers), and poor mesh quality (high skewness, non-orthogonality).
5.  Your response must be a JSON object that validates against the provided schema. Do not add any extra text, explanations, or markdown formatting outside of the JSON structure.
6.  Generate 3-7 items for 'Potential Issues' and 'Recommendations', and at least 3 items for 'Quick Checklist'.
`;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        overallLikelihood: {
            type: Type.OBJECT,
            properties: {
                level: { 
                    type: Type.STRING,
                    enum: ["High", "Medium", "Low"],
                    description: "The overall likelihood of convergence."
                },
                reason: { 
                    type: Type.STRING,
                    description: "A concise, one-line justification for the likelihood."
                },
            },
            required: ["level", "reason"],
        },
        potentialIssues: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING,
                description: "A potential issue that could hinder convergence."
            },
            description: "A list of 3-7 concise bullet points on potential issues."
        },
        recommendations: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING,
                description: "A recommendation to improve convergence."
            },
            description: "A list of 3-7 concise bullet points with recommendations."
        },
        quickChecklist: {
            type: Type.ARRAY,
            items: { 
                type: Type.STRING,
                description: "A short, actionable checklist item."
            },
            description: "A short, actionable checklist."
        },
    },
    required: ["overallLikelihood", "potentialIssues", "recommendations", "quickChecklist"],
};


export const getConvergenceAssessment = async (setup: string): Promise<Assessment> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: setup,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonText = response.text.trim();
        const assessmentData: Assessment = JSON.parse(jsonText);
        return assessmentData;

    } catch (error) {
        console.error("Error fetching assessment from Gemini API:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get assessment: ${error.message}`);
        }
        throw new Error("An unknown error occurred while fetching the assessment.");
    }
};