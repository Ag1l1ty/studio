import { RiskAssessmentForm } from "@/components/risk/risk-assessment-form";

export default function RiskAssessmentPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold tracking-tight mb-2">New Project Risk Assessment</h2>
                <p className="text-muted-foreground mb-6">
                    Fill out this form to determine the initial risk level of a new project. The score is calculated based on weighted questions about project scope, technology, team, and dependencies.
                </p>
                <RiskAssessmentForm />
            </div>
        </div>
    );
}
