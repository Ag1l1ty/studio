
"use client";

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAdminForm } from "@/components/configure/user-admin-form";
import { ProjectAdminForm } from "@/components/configure/project-admin-form";
import { DeliveryAdminForm } from "@/components/configure/delivery-admin-form";
import { RiskAdminForm } from "@/components/configure/risk-admin-form";
import { Users, FolderKanban, Package, ShieldAlert } from "lucide-react";

export default function ConfigurePage() {
    const [mounted, setMounted] = useState(false);
    const [forceOverride, setForceOverride] = useState(false);
    
    useEffect(() => {
        console.log('ConfigurePage - Component mounting');
        setMounted(true);
        
        if (typeof window !== 'undefined') {
            console.log('ConfigurePage - Current URL:', window.location.pathname);
            
            if (window.location.pathname === '/configure') {
                console.log('ConfigurePage - Detected /configure route, implementing aggressive override');
                
                setTimeout(() => {
                    console.log('ConfigurePage - Starting aggressive page override');
                    
                    const body = document.body;
                    const existingOverride = document.getElementById('configure-override');
                    
                    if (!existingOverride) {
                        console.log('ConfigurePage - Creating complete page override');
                        
                        body.innerHTML = '';
                        
                        const pageContainer = document.createElement('div');
                        pageContainer.id = 'configure-override';
                        pageContainer.style.cssText = 'min-height: 100vh; background: #f9fafb; font-family: Inter, sans-serif;';
                        
                        pageContainer.innerHTML = `
                            <div style="display: flex; min-height: 100vh;">
                                <!-- Sidebar Navigation -->
                                <nav style="width: 240px; background: #1e293b; color: white; padding: 1rem; flex-shrink: 0;">
                                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 2rem;">
                                        <div style="width: 32px; height: 32px; background: #3b82f6; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">A</div>
                                        <div>
                                            <h2 style="font-size: 1.125rem; font-weight: 600; margin: 0; color: white;">AXA Insights</h2>
                                            <p style="font-size: 0.75rem; color: #94a3b8; margin: 0;">Portfolio Dashboard</p>
                                        </div>
                                    </div>
                                    <ul style="list-style: none; padding: 0; margin: 0;">
                                        <li style="margin-bottom: 0.5rem;">
                                            <a href="/" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border-radius: 0.375rem; color: #94a3b8; text-decoration: none; transition: all 0.2s;">
                                                <span>📊</span> Dashboard
                                            </a>
                                        </li>
                                        <li style="margin-bottom: 0.5rem;">
                                            <a href="/kanban" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border-radius: 0.375rem; color: #94a3b8; text-decoration: none; transition: all 0.2s;">
                                                <span>📋</span> Kanban Board
                                            </a>
                                        </li>
                                        <li style="margin-bottom: 0.5rem;">
                                            <a href="/risk-assessment" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border-radius: 0.375rem; color: #94a3b8; text-decoration: none; transition: all 0.2s;">
                                                <span>⚠️</span> Risk Assessment
                                            </a>
                                        </li>
                                        <li style="margin-bottom: 0.5rem;">
                                            <a href="/risk-monitoring" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border-radius: 0.375rem; color: #94a3b8; text-decoration: none; transition: all 0.2s;">
                                                <span>📈</span> Risk Monitoring
                                            </a>
                                        </li>
                                        <li style="margin-bottom: 0.5rem;">
                                            <a href="/configure" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border-radius: 0.375rem; background: #3b82f6; color: white; text-decoration: none;">
                                                <span>⚙️</span> Administration
                                            </a>
                                        </li>
                                    </ul>
                                    
                                    <!-- User Info -->
                                    <div style="position: absolute; bottom: 1rem; left: 1rem; right: 1rem;">
                                        <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; background: rgba(255,255,255,0.1); border-radius: 0.375rem;">
                                            <div style="width: 32px; height: 32px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 0.875rem; font-weight: 600;">JS</div>
                                            <div style="flex: 1; min-width: 0;">
                                                <p style="font-size: 0.875rem; font-weight: 500; margin: 0; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Jose Andres Sanchez</p>
                                                <p style="font-size: 0.75rem; color: #94a3b8; margin: 0;">Admin</p>
                                            </div>
                                            <button onclick="logout()" style="background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0.25rem;">
                                                <span style="font-size: 1rem;">🚪</span>
                                            </button>
                                        </div>
                                    </div>
                                </nav>
                                
                                <!-- Main Content -->
                                <main style="flex: 1; padding: 2rem; overflow-y: auto;">
                                    <div style="max-width: 1200px;">
                                        <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 0.5rem; color: #111827;">Administración de la Herramienta</h1>
                                        <p style="color: #6b7280; margin-bottom: 2rem; font-size: 1rem;">Utilice esta sección para administrar todos los aspectos de la herramienta de portafolio.</p>
                                        
                                        <!-- Tabs -->
                                        <div style="border-bottom: 1px solid #e5e7eb; margin-bottom: 2rem;">
                                            <nav style="display: flex; gap: 0;">
                                                <button onclick="showTab('users')" id="tab-users" style="padding: 1rem 1.5rem; border: none; background: none; color: #3b82f6; border-bottom: 2px solid #3b82f6; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
                                                    <span>👥</span> Usuarios y Roles
                                                </button>
                                                <button onclick="showTab('projects')" id="tab-projects" style="padding: 1rem 1.5rem; border: none; background: none; color: #6b7280; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
                                                    <span>📁</span> Proyectos
                                                </button>
                                                <button onclick="showTab('deliveries')" id="tab-deliveries" style="padding: 1rem 1.5rem; border: none; background: none; color: #6b7280; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
                                                    <span>📦</span> Entregas
                                                </button>
                                                <button onclick="showTab('risks')" id="tab-risks" style="padding: 1rem 1.5rem; border: none; background: none; color: #6b7280; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem;">
                                                    <span>⚠️</span> Riesgos
                                                </button>
                                            </nav>
                                        </div>
                                        
                                        <!-- Tab Content -->
                                        <div id="content-users" style="display: block;">
                                            <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                                <div style="padding: 1.5rem; border-bottom: 1px solid #e5e7eb;">
                                                    <h3 style="font-size: 1.5rem; font-weight: 600; margin: 0 0 0.5rem 0; color: #111827;">Gestión de Usuarios</h3>
                                                    <p style="color: #6b7280; margin: 0;">Administre usuarios, roles y permisos del sistema</p>
                                                </div>
                                                <div style="padding: 1.5rem;">
                                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                                                        <p style="color: #6b7280; margin: 0; font-weight: 500;">Usuarios registrados en el sistema</p>
                                                        <button onclick="createUser()" style="background: #3b82f6; color: white; padding: 0.75rem 1.5rem; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s;" onmouseover="this.style.background='#2563eb'" onmouseout="this.style.background='#3b82f6'">
                                                            <span style="font-size: 1rem;">➕</span> Agregar Usuario
                                                        </button>
                                                    </div>
                                                    <div id="user-list" style="min-height: 200px;">
                                                        <div style="text-align: center; padding: 3rem; color: #6b7280;">
                                                            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
                                                            <p style="margin: 0; font-size: 1.125rem;">Cargando usuarios...</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div id="content-projects" style="display: none;">
                                            <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem;">
                                                <h3 style="font-size: 1.5rem; font-weight: 600; margin: 0 0 1rem 0; color: #111827;">Gestión de Proyectos</h3>
                                                <p style="color: #6b7280; margin: 0;">Administre proyectos y asignaciones del portafolio</p>
                                            </div>
                                        </div>
                                        
                                        <div id="content-deliveries" style="display: none;">
                                            <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem;">
                                                <h3 style="font-size: 1.5rem; font-weight: 600; margin: 0 0 1rem 0; color: #111827;">Gestión de Entregas</h3>
                                                <p style="color: #6b7280; margin: 0;">Administre entregas y cronogramas del proyecto</p>
                                            </div>
                                        </div>
                                        
                                        <div id="content-risks" style="display: none;">
                                            <div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem;">
                                                <h3 style="font-size: 1.5rem; font-weight: 600; margin: 0 0 1rem 0; color: #111827;">Gestión de Riesgos</h3>
                                                <p style="color: #6b7280; margin: 0;">Administre evaluaciones y monitoreo de riesgos</p>
                                            </div>
                                        </div>
                                    </div>
                                </main>
                            </div>
                            
                            <script>
                                console.log('ConfigurePage - JavaScript loaded');
                                
                                function showTab(tabName) {
                                    console.log('ConfigurePage - Switching to tab:', tabName);
                                    
                                    document.querySelectorAll('[id^="content-"]').forEach(el => el.style.display = 'none');
                                    document.querySelectorAll('[id^="tab-"]').forEach(el => {
                                        el.style.color = '#6b7280';
                                        el.style.borderBottom = 'none';
                                    });
                                    
                                    const contentEl = document.getElementById('content-' + tabName);
                                    const tabEl = document.getElementById('tab-' + tabName);
                                    
                                    if (contentEl) contentEl.style.display = 'block';
                                    if (tabEl) {
                                        tabEl.style.color = '#3b82f6';
                                        tabEl.style.borderBottom = '2px solid #3b82f6';
                                    }
                                }
                                
                                function createUser() {
                                    console.log('ConfigurePage - Create user clicked');
                                    
                                    const name = prompt('Nombre completo del usuario:');
                                    if (!name || name.trim() === '') {
                                        alert('El nombre es requerido');
                                        return;
                                    }
                                    
                                    const email = prompt('Email del usuario:');
                                    if (!email || email.trim() === '' || !email.includes('@')) {
                                        alert('Email válido es requerido');
                                        return;
                                    }
                                    
                                    const password = prompt('Contraseña del usuario (mínimo 6 caracteres):');
                                    if (!password || password.length < 6) {
                                        alert('La contraseña debe tener al menos 6 caracteres');
                                        return;
                                    }
                                    
                                    const role = prompt('Rol del usuario:\\n1. Admin\\n2. PM/SM\\n3. Viewer\\n4. Portfolio Manager\\n\\nIngrese el número (1-4):');
                                    const roleMap = {
                                        '1': 'Admin',
                                        '2': 'PM/SM', 
                                        '3': 'Viewer',
                                        '4': 'Portfolio Manager'
                                    };
                                    
                                    if (!roleMap[role]) {
                                        alert('Rol inválido. Debe seleccionar 1, 2, 3 o 4');
                                        return;
                                    }
                                    
                                    const selectedRole = roleMap[role];
                                    
                                    console.log('ConfigurePage - Creating user:', { name, email, role: selectedRole });
                                    
                                    try {
                                        let users = [];
                                        const stored = localStorage.getItem('axa-portfolio-users');
                                        if (stored) {
                                            users = JSON.parse(stored);
                                        }
                                        
                                        if (users.find(u => u.email === email)) {
                                            alert('Ya existe un usuario con este email');
                                            return;
                                        }
                                        
                                        const hashedPassword = btoa(password + 'salt');
                                        
                                        // Create new user
                                        const newUser = {
                                            id: 'USR-' + String(users.length + 1).padStart(3, '0'),
                                            name: name.trim(),
                                            email: email.trim().toLowerCase(),
                                            password: hashedPassword,
                                            role: selectedRole,
                                            projects: [],
                                            createdAt: new Date().toISOString()
                                        };
                                        
                                        users.push(newUser);
                                        
                                        localStorage.setItem('axa-portfolio-users', JSON.stringify(users));
                                        
                                        alert('✅ Usuario creado exitosamente:\\n\\nNombre: ' + name + '\\nEmail: ' + email + '\\nRol: ' + selectedRole + '\\n\\nEl usuario ya puede iniciar sesión con sus credenciales.');
                                        
                                        loadUsers();
                                        
                                    } catch (error) {
                                        console.error('ConfigurePage - Error creating user:', error);
                                        alert('❌ Error al crear el usuario. Intente nuevamente.');
                                    }
                                }
                                
                                function loadUsers() {
                                    console.log('ConfigurePage - Loading users');
                                    
                                    try {
                                        const stored = localStorage.getItem('axa-portfolio-users');
                                        const users = stored ? JSON.parse(stored) : [];
                                        
                                        console.log('ConfigurePage - Found users:', users.length);
                                        
                                        const userList = document.getElementById('user-list');
                                        if (!userList) return;
                                        
                                        if (users.length === 0) {
                                            userList.innerHTML = '<div style="text-align: center; padding: 3rem; color: #6b7280;"><div style="font-size: 3rem; margin-bottom: 1rem;">👤</div><p style="margin: 0; font-size: 1.125rem;">No hay usuarios registrados</p><p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">Haga clic en "Agregar Usuario" para crear el primer usuario</p></div>';
                                        } else {
                                            userList.innerHTML = '<div style="space-y: 0.75rem;">' + users.map(user => 
                                                '<div style="border: 1px solid #e5e7eb; border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; background: #fafafa;">' +
                                                    '<div style="flex: 1;">' +
                                                        '<h4 style="margin: 0 0 0.25rem 0; font-weight: 600; color: #111827; font-size: 1rem;">' + user.name + '</h4>' +
                                                        '<p style="margin: 0; color: #6b7280; font-size: 0.875rem;">' + user.email + '</p>' +
                                                        '<p style="margin: 0.25rem 0 0 0; color: #3b82f6; font-size: 0.75rem; font-weight: 500;">' + user.role + '</p>' +
                                                    '</div>' +
                                                    '<div style="display: flex; gap: 0.5rem;">' +
                                                        '<button onclick="testLogin(\'' + user.email + '\')" style="background: #10b981; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; font-weight: 500;" onmouseover="this.style.background=\\'#059669\\'" onmouseout="this.style.background=\\'#10b981\\'">Probar Login</button>' +
                                                        '<button onclick="deleteUser(\'' + user.id + '\')" style="background: #ef4444; color: white; padding: 0.5rem 1rem; border: none; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; font-weight: 500;" onmouseover="this.style.background=\\'#dc2626\\'" onmouseout="this.style.background=\\'#ef4444\\'">Eliminar</button>' +
                                                    '</div>' +
                                                '</div>'
                                            ).join('') + '</div>';
                                        }
                                    } catch (error) {
                                        console.error('ConfigurePage - Error loading users:', error);
                                        const userList = document.getElementById('user-list');
                                        if (userList) {
                                            userList.innerHTML = '<div style="text-align: center; padding: 3rem; color: #ef4444;"><div style="font-size: 3rem; margin-bottom: 1rem;">❌</div><p style="margin: 0; font-size: 1.125rem;">Error al cargar usuarios</p></div>';
                                        }
                                    }
                                }
                                
                                function testLogin(email) {
                                    console.log('ConfigurePage - Testing login for:', email);
                                    
                                    const password = prompt('Ingrese la contraseña para ' + email + ':');
                                    if (!password) return;
                                    
                                    try {
                                        const stored = localStorage.getItem('axa-portfolio-users');
                                        const users = stored ? JSON.parse(stored) : [];
                                        const user = users.find(u => u.email === email);
                                        
                                        if (user && btoa(password + 'salt') === user.password) {
                                            alert('✅ ¡Login exitoso!\\n\\nUsuario: ' + user.name + '\\nRol: ' + user.role + '\\n\\nEl usuario puede acceder al sistema correctamente.');
                                            
                                            localStorage.setItem('axa-portfolio-session', JSON.stringify({ id: user.id }));
                                            
                                            if (confirm('¿Desea ir al dashboard con este usuario?')) {
                                                window.location.href = '/';
                                            }
                                        } else {
                                            alert('❌ Credenciales incorrectas\\n\\nVerifique que la contraseña sea correcta.');
                                        }
                                    } catch (error) {
                                        console.error('ConfigurePage - Error testing login:', error);
                                        alert('❌ Error al probar el login. Intente nuevamente.');
                                    }
                                }
                                
                                function deleteUser(userId) {
                                    console.log('ConfigurePage - Deleting user:', userId);
                                    
                                    if (!confirm('¿Está seguro de que desea eliminar este usuario?\\n\\nEsta acción no se puede deshacer.')) {
                                        return;
                                    }
                                    
                                    try {
                                        const stored = localStorage.getItem('axa-portfolio-users');
                                        let users = stored ? JSON.parse(stored) : [];
                                        
                                        const userToDelete = users.find(u => u.id === userId);
                                        if (!userToDelete) {
                                            alert('Usuario no encontrado');
                                            return;
                                        }
                                        
                                        if (userToDelete.email === 'joseandres.sanchez@agilitychanges.com') {
                                            alert('No se puede eliminar el usuario administrador principal');
                                            return;
                                        }
                                        
                                        users = users.filter(u => u.id !== userId);
                                        localStorage.setItem('axa-portfolio-users', JSON.stringify(users));
                                        
                                        alert('✅ Usuario eliminado exitosamente');
                                        loadUsers();
                                        
                                    } catch (error) {
                                        console.error('ConfigurePage - Error deleting user:', error);
                                        alert('❌ Error al eliminar el usuario. Intente nuevamente.');
                                    }
                                }
                                
                                function logout() {
                                    console.log('ConfigurePage - Logout clicked');
                                    
                                    if (confirm('¿Está seguro de que desea cerrar sesión?')) {
                                        localStorage.removeItem('axa-portfolio-session');
                                        window.location.href = '/';
                                    }
                                }
                                
                                setTimeout(() => {
                                    console.log('ConfigurePage - Initial user load');
                                    loadUsers();
                                }, 500);
                            </script>
                        `;
                        
                        body.appendChild(pageContainer);
                        console.log('ConfigurePage - Complete page override created');
                        setForceOverride(true);
                    }
                }, 100);
            }
        }
    }, []);

    if (!mounted || !forceOverride) {
        return (
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Administración de la Herramienta</h2>
                <p className="text-muted-foreground mb-6">Cargando interfaz de administración...</p>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Administración de la Herramienta</h2>
            <p className="text-muted-foreground mb-6">
                Utilice esta sección para administrar todos los aspectos de la herramienta de portafolio.
            </p>
            <Tabs defaultValue="users" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="users">
                        <Users className="mr-2 h-4 w-4" />
                        Usuarios y Roles
                    </TabsTrigger>
                    <TabsTrigger value="projects">
                         <FolderKanban className="mr-2 h-4 w-4" />
                        Proyectos
                    </TabsTrigger>
                    <TabsTrigger value="deliveries">
                        <Package className="mr-2 h-4 w-4" />
                        Entregas
                    </TabsTrigger>
                    <TabsTrigger value="risk">
                        <ShieldAlert className="mr-2 h-4 w-4" />
                        Riesgos
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="users" className="space-y-4">
                    <UserAdminForm />
                </TabsContent>
                <TabsContent value="projects" className="space-y-4">
                    <ProjectAdminForm />
                </TabsContent>
                <TabsContent value="deliveries" className="space-y-4">
                    <DeliveryAdminForm />
                </TabsContent>
                <TabsContent value="risk" className="space-y-4">
                    <RiskAdminForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
