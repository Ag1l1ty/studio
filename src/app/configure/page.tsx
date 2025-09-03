import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAdminForm } from "@/components/configure/user-admin-form";
import { ProjectAdminForm } from "@/components/configure/project-admin-form";
import { DeliveryAdminForm } from "@/components/configure/delivery-admin-form";
import { RiskAdminForm } from "@/components/configure/risk-admin-form";
import { Users, FolderKanban, Package, ShieldAlert, Database } from "lucide-react";

export default function ConfigurePage() {

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Administración de la Herramienta</h2>
            <p className="text-muted-foreground mb-6">Gestiona usuarios, proyectos, entregas y perfiles de riesgo.</p>
            
            <Tabs defaultValue="users" className="space-y-4">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Usuarios
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="flex items-center gap-2">
                        <FolderKanban className="h-4 w-4" />
                        Proyectos
                    </TabsTrigger>
                    <TabsTrigger value="deliveries" className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Entregas
                    </TabsTrigger>
                    <TabsTrigger value="risks" className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4" />
                        Riesgos
                    </TabsTrigger>
                    <TabsTrigger value="migration" className="flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        Migración
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="users">
                    <UserAdminForm />
                </TabsContent>
                
                <TabsContent value="projects">
                    <ProjectAdminForm />
                </TabsContent>
                
                <TabsContent value="deliveries">
                    <DeliveryAdminForm />
                </TabsContent>
                
                <TabsContent value="risks">
                    <RiskAdminForm />
                </TabsContent>
                
                <TabsContent value="migration">
                    <div className="space-y-6">
                        <div className="p-6 bg-muted rounded-lg">
                            <h3 className="text-lg font-medium mb-2">Migración a Supabase</h3>
                            <p className="mb-4">La funcionalidad de migración estará disponible próximamente.</p>
                            <p>Para configurar Supabase, añade las siguientes variables de entorno en tu archivo .env.local:</p>
                            <pre className="p-4 bg-card rounded-md mt-2 overflow-x-auto">
                                <code>
                                    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url{"\n"}
                                    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key{"\n"}
                                    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
                                </code>
                            </pre>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
