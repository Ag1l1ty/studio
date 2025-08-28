import { RiskMonitoringForm } from "@/components/risk/risk-monitoring-form";

export default function RiskMonitoringPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Project Risk Monitoring</h2>
                <p className="text-muted-foreground mb-6">
                    Update a project's risk score based on its execution. This helps in dynamically tracking and managing risk throughout the project lifecycle.
                </p>
                <RiskMonitoringForm />
            </div>
        </div>
    );
}
