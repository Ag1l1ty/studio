import { ProjectConfigurationForm } from "@/components/projects/project-configuration-form";

export default function ConfigurePage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold tracking-tight mb-2">Project Configuration</h2>
                <p className="text-muted-foreground mb-6">
                    Use this form to create a new project or edit an existing one. All fields are required to properly track the project in the portfolio.
                </p>
                <ProjectConfigurationForm />
            </div>
        </div>
    );
}
