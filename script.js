// App state
const app = {
    currentUser: null,
    isMobile: window.innerWidth <= 768,
    sidebarCollapsed: false,
    data: {
        materias: [
            { 
                id: 'mat1', 
                nombre: 'Matemática I',
                profesor: 'Laura Martínez',
                horario: 'Lunes 18:30 - 22:30',
                aula: 'Lab 1',
                curso: 'TDS1A'
            },
            { 
                id: 'prog1', 
                nombre: 'Programación I',
                profesor: 'Carlos García',
                horario: 'Martes 18:30 - 22:30',
                aula: 'Lab 2',
                curso: 'TDS1A'
            },
            { 
                id: 'bd1', 
                nombre: 'Base de Datos',
                profesor: 'Ana López',
                horario: 'Miércoles 18:30 - 22:30',
                aula: 'Lab 3',
                curso: 'TDS1A'
            },
            { 
                id: 'ing1', 
                nombre: 'Inglés Técnico',
                profesor: 'John Smith',
                horario: 'Jueves 18:30 - 22:30',
                aula: '104',
                curso: 'TDS1A'
            }
        ],
        notas: [
            { 
                materiaId: 'mat1',
                alumnoId: 'alumno1',
                tipo: 'Primer Parcial',
                nota: 8.5,
                fecha: '2025-08-15'
            },
            { 
                materiaId: 'mat1',
                alumnoId: 'alumno1',
                tipo: 'Trabajo Práctico 1',
                nota: 9,
                fecha: '2025-08-25'
            },
            { 
                materiaId: 'prog1',
                alumnoId: 'alumno1',
                tipo: 'Primer Parcial',
                nota: 7.5,
                fecha: '2025-08-20'
            },
            { 
                materiaId: 'bd1',
                alumnoId: 'alumno1',
                tipo: 'Trabajo Práctico 1',
                nota: 8,
                fecha: '2025-09-01'
            }
        ],
        asistencias: [
            {
                materiaId: 'mat1',
                alumnoId: 'alumno1',
                fecha: '2025-09-02',
                estado: 'presente'
            },
            {
                materiaId: 'mat1',
                alumnoId: 'alumno1',
                fecha: '2025-08-26',
                estado: 'ausente'
            },
            {
                materiaId: 'prog1',
                alumnoId: 'alumno1',
                fecha: '2025-09-03',
                estado: 'presente'
            },
            {
                materiaId: 'bd1',
                alumnoId: 'alumno1',
                fecha: '2025-09-04',
                estado: 'tarde'
            }
        ],
        eventos: [
            {
                id: 1,
                titulo: 'Parcial de Matemática',
                descripcion: 'Primer parcial del cuatrimestre',
                fecha: '2025-09-15',
                materiaId: 'mat1',
                tipo: 'evaluacion'
            },
            {
                id: 2,
                titulo: 'Entrega TP Programación',
                descripcion: 'Entrega del trabajo práctico de Arrays y Objetos',
                fecha: '2025-09-20',
                materiaId: 'prog1',
                tipo: 'entrega'
            },
            {
                id: 3,
                titulo: 'Feriado Nacional',
                descripcion: 'No hay actividad académica',
                fecha: '2025-09-21',
                tipo: 'feriado'
            },
            {
                id: 4,
                titulo: 'Hackathon 2025',
                descripcion: 'Competencia de programación por equipos',
                fecha: '2025-10-05',
                tipo: 'evento'
            }
        ],
        usuarios: [
            {
                id: 'alumno1',
                nombre: 'María González',
                rol: 'alumno',
                Carrera: 'Tecnicatura Superior en Desarrollo de Software - 1° Año',
                email: 'maria@instituto26.edu.ar'
            },
            {
                id: 'profesor1',
                nombre: 'Laura Martínez',
                rol: 'profesor',
                materias: ['mat1'],
                email: 'laura@instituto26.edu.ar'
            },
            {
                id: 'preceptor1',
                nombre: 'Carlos Rodríguez',
                rol: 'preceptor',
                cursos: ['TDS1A'],
                email: 'carlos@instituto26.edu.ar'
            }
        ],
        cursos: [
            {
                id: 'TDS1A',
                nombre: 'Tecnicatura en Desarrollo de Software - 1° Año A',
                turno: 'Noche',
                horario: '18:30 - 22:30'
            }
        ]
    }
};

// Show error message
function showError(message) {
    const loginError = document.getElementById('loginError');
    if (loginError) {
        loginError.textContent = message;
        loginError.style.display = 'block';
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            loginError.style.display = 'none';
            loginError.textContent = '';
        }, 3000);
    }
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    setupLogin();
    setupSidebar();
});

// Window resize handler
window.addEventListener('resize', () => {
    app.isMobile = window.innerWidth <= 768;
    updateSidebarState();
});

// Setup login functionality
function setupLogin() {
    const loginScreen = document.getElementById('loginScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    const loginForm = document.getElementById('loginForm');
    const userSelect = document.getElementById('userType');
    const loginError = document.getElementById('loginError');
    const logoutBtn = document.getElementById('logoutBtn');

    // Show login screen initially
    if (loginScreen && dashboardScreen) {
        loginScreen.style.display = 'flex';
        dashboardScreen.style.display = 'none';
    }

    // Handle form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = userSelect.value;
            
            if (!role) {
                showError('Por favor selecciona un tipo de usuario');
                return;
            }
            
            handleLogin(role);
        });
        
        // Clear error when user changes selection
        userSelect.addEventListener('change', () => {
            if (loginError) {
                loginError.style.display = 'none';
                loginError.textContent = '';
            }
        });
    }

    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            handleLogout();
        });
    }
}

// Login handler function
function handleLogin(role) {
    // Get user from app.data.usuarios based on role
    const user = app.data.usuarios.find(u => u.rol === role);
    
    if (!user) {
        showError('Usuario no encontrado. Por favor selecciona un tipo de usuario válido.');
        return;
    }

    // Update app state with full user data
    app.currentUser = {
        id: user.id,
        name: user.nombre,
        role: user.rol,
        email: user.email,
        curso: user.curso,
        materias: user.materias,
        cursos: user.cursos
    };

    // Update UI
    updateUI();
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = `Bienvenido/a, ${user.nombre}`;
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Logout handler function
function handleLogout() {
    // Clear current user
    app.currentUser = null;
    
    // Reset any active content
    const dashboardContent = document.getElementById('dashboardContent');
    if (dashboardContent) {
        dashboardContent.innerHTML = '';
    }
    
    // Reset form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.reset();
    }
    
    // Update UI
    updateUI();
    
    // Show logout message
    const logoutMessage = document.createElement('div');
    logoutMessage.className = 'success-message';
    logoutMessage.textContent = 'Has cerrado sesión correctamente';
    document.body.appendChild(logoutMessage);
    
    setTimeout(() => {
        logoutMessage.remove();
    }, 3000);
}

// Setup sidebar functionality
function setupSidebar() {
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            closeSidebar();
        });
    }

    // Cerrar sidebar al hacer clic fuera en móvil
    document.addEventListener('click', (e) => {
        if (app.isMobile && !app.sidebarCollapsed) {
            const clickedInside = sidebar.contains(e.target) || toggleBtn.contains(e.target);
            if (!clickedInside) {
                closeSidebar();
            }
        }
    });

    updateSidebarState();
}

// Toggle sidebar
function toggleSidebar() {
    app.sidebarCollapsed = !app.sidebarCollapsed;
    updateSidebarState();
}

// Close sidebar
function closeSidebar() {
    app.sidebarCollapsed = true;
    updateSidebarState();
}

// Update sidebar state
function updateSidebarState() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const contentArea = document.querySelector('.content-area');

    if (sidebar) {
        if (app.isMobile) {
            // En móvil
            if (app.sidebarCollapsed) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            } else {
                sidebar.classList.add('active');
                overlay.classList.add('active');
            }
        } else {
            // En desktop
            if (app.sidebarCollapsed) {
                sidebar.classList.add('collapsed');
                if (contentArea) {
                    contentArea.style.marginLeft = '80px';
                }
            } else {
                sidebar.classList.remove('collapsed');
                if (contentArea) {
                    contentArea.style.marginLeft = '250px';
                }
            }
        }
    }
}

// Update navigation menu
function updateNavigation(nav) {
    const menuItems = {
        alumno: [
            { text: 'Mi Perfil', icon: 'fas fa-user', section: 'perfil' },
            { text: 'Mis Materias', icon: 'fas fa-book', section: 'materias' },
            { text: 'Mis Notas', icon: 'fas fa-star', section: 'notas' },
            { text: 'Asistencia', icon: 'fas fa-calendar-check', section: 'asistencia' }
        ],
        profesor: [
            { text: 'Mi Perfil', icon: 'fas fa-user', section: 'perfil' },
            { text: 'Mis Cursos', icon: 'fas fa-chalkboard-teacher', section: 'cursos' },
            { text: 'Cargar Notas', icon: 'fas fa-pen', section: 'notas' },
            { text: 'Asistencia', icon: 'fas fa-clipboard-check', section: 'asistencia' }
        ],
        preceptor: [
            { text: 'Mi Perfil', icon: 'fas fa-user', section: 'perfil' },
            { text: 'Cursos', icon: 'fas fa-graduation-cap', section: 'cursos' },
            { text: 'Asistencia', icon: 'fas fa-clipboard-list', section: 'asistencia' },
            { text: 'Alumnos', icon: 'fas fa-users', section: 'alumnos' }
        ],
        admin: [
            { text: 'Dashboard', icon: 'fas fa-tachometer-alt', section: 'dashboard' },
            { text: 'Usuarios', icon: 'fas fa-users-cog', section: 'usuarios' },
            { text: 'Materias', icon: 'fas fa-book', section: 'materias' },
            { text: 'Configuración', icon: 'fas fa-cog', section: 'config' }
        ]
    };

    if (nav && app.currentUser) {
        const items = menuItems[app.currentUser.role] || [];
        nav.innerHTML = items.map(item => `
            <a href="#" class="nav-item" data-section="${item.section}">
                <i class="${item.icon}"></i>
                <span>${item.text}</span>
            </a>
        `).join('');

        // Add click handlers
        nav.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showSection(item.dataset.section);
            });
        });
    }
}

// Show section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.feature-section').forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }

    // Update content based on section
    updateSectionContent(sectionId);

    // Close sidebar on mobile
    if (app.isMobile) {
        app.sidebarCollapsed = true;
        updateSidebarState();
    }
}

// Update UI based on login state
function updateUI() {
    const loginScreen = document.getElementById('loginScreen');
    const dashboardScreen = document.getElementById('dashboardScreen');
    const sidebar = document.getElementById('sidebar');
    const loggedInUser = document.getElementById('loggedInUser');
    const pageTitle = document.getElementById('pageTitle');
    const mainNav = document.querySelector('.main-nav');
    const toggleBtn = document.getElementById('toggleSidebar');

    if (app.currentUser) {
        // Show dashboard
        if (loginScreen) loginScreen.style.display = 'none';
        if (dashboardScreen) dashboardScreen.style.display = 'block';
        if (sidebar) sidebar.style.display = 'flex';
        
        // Show toggle button
        if (toggleBtn) toggleBtn.style.display = 'flex';

        // Update user info
        if (loggedInUser) loggedInUser.textContent = app.currentUser.name;
        if (pageTitle) pageTitle.textContent = `Bienvenido/a, ${app.currentUser.name}`;

        // Update navigation
        if (mainNav) updateNavigation(mainNav);
        
        // Update sidebar state
        updateSidebarState();

        // Show default section based on role
        const defaultSections = {
            alumno: 'materias',
            profesor: 'cursos',
            preceptor: 'asistencia',
            admin: 'dashboard'
        };

        const defaultSection = defaultSections[app.currentUser.role];
        if (defaultSection) {
            showSection(defaultSection);
        }
    } else {
        // Show login
        if (loginScreen) loginScreen.style.display = 'flex';
        if (dashboardScreen) dashboardScreen.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        
        // Hide toggle button
        if (toggleBtn) toggleBtn.style.display = 'none';

        // Clear form if it exists
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
    }

    if (app.currentUser) {
        // Show dashboard
        loginScreen.style.display = 'none';
        dashboardScreen.style.display = 'block';
        sidebar.style.display = 'flex';

        // Show toggle button
        const toggleBtn = document.getElementById('toggleSidebar');
        if (toggleBtn) {
            toggleBtn.style.display = 'flex';
        }

        // Update user info
        loggedInUser.textContent = app.currentUser.name;
        pageTitle.textContent = `Bienvenido/a, ${app.currentUser.name}`;

        // Update navigation
        updateNavigation(mainNav);
        
        // Update sidebar state
        updateSidebarState();

        // Show default section based on role
        const defaultSections = {
            alumno: 'materias',
            profesor: 'cursos',
            preceptor: 'asistencia',
            admin: 'dashboard'
        };
        showSection(defaultSections[app.currentUser.role]);
    } else {
        // Show login
        loginScreen.style.display = 'flex';
        dashboardScreen.style.display = 'none';
        sidebar.style.display = 'none';

        // Hide toggle button
        const toggleBtn = document.getElementById('toggleSidebar');
        if (toggleBtn) {
            toggleBtn.style.display = 'none';
        }

        // Clear form if it exists
        const loginForm = document.getElementById('loginForm');
        if (loginForm) loginForm.reset();
    }
}

// Update section content
function updateSectionContent(sectionId) {
    const contentFunctions = {
        materias: generateMateriasHTML,
        notas: generateNotasHTML,
        asistencia: generateAsistenciaHTML,
        perfil: generatePerfilHTML
    };

    const contentFunction = contentFunctions[sectionId];
    if (contentFunction) {
        const dashboardContent = document.getElementById('dashboardContent');
        if (dashboardContent) {
            dashboardContent.innerHTML = contentFunction();
        }
    }
}

// Format date helper function
function formatDate(dateString) {
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('es-AR', options);
}

// Get badge class based on nota
function getNotaBadgeClass(nota) {
    if (nota >= 8) return 'badge-success';
    if (nota >= 6) return 'badge-warning';
    return 'badge-danger';
}

// Generate Materias HTML
function generateMateriasHTML() {
    const materias = app.data.materias;
    const user = app.currentUser;

    // Filtrar materias según el rol
    let materiasToShow = materias;
    if (user.role === 'profesor') {
        materiasToShow = materias.filter(m => user.materias.includes(m.id));
    } else if (user.role === 'preceptor') {
        materiasToShow = materias.filter(m => user.cursos.includes(m.curso));
    }

    return `
        <div class="section-content">
            <h2><i class="fas fa-book"></i> ${user.role === 'alumno' ? 'Mis Materias' : 'Materias a Cargo'}</h2>
            <div class="materias-grid">
                ${materiasToShow.map(materia => `
                    <div class="materia-card">
                        <div class="materia-card-header">
                            <h3>${materia.nombre}</h3>
                            <span class="materia-curso">${materia.curso}</span>
                        </div>
                        <div class="materia-card-body">
                            <div class="materia-info">
                                ${user.role === 'profesor' ? `
                                    <div class="profesor-stats">
                                        <p><i class="fas fa-users"></i> 25 alumnos</p>
                                        <p><i class="fas fa-clipboard-check"></i> 8 clases dictadas</p>
                                        <p><i class="fas fa-tasks"></i> 3 evaluaciones pendientes</p>
                                    </div>
                                ` : user.role === 'preceptor' ? `
                                    <div class="preceptor-stats">
                                        <p><i class="fas fa-user-check"></i> 85% asistencia promedio</p>
                                        <p><i class="fas fa-exclamation-triangle"></i> 3 inasistencias críticas</p>
                                        <p><i class="fas fa-clipboard-list"></i> 2 justificaciones pendientes</p>
                                    </div>
                                ` : `
                                    <p><i class="fas fa-user"></i> ${materia.profesor}</p>
                                    <p><i class="fas fa-clock"></i> ${materia.horario}</p>
                                    <p><i class="fas fa-map-marker-alt"></i> ${materia.aula}</p>
                                `}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Generate Notas HTML
function generateNotasHTML() {
    const user = app.currentUser;
    const notas = app.data.notas;
    const materias = app.data.materias;
    const usuarios = app.data.usuarios;

    // Filtrar materias según el rol
    let materiasToShow = materias;
    if (user.role === 'profesor') {
        materiasToShow = materias.filter(m => user.materias.includes(m.id));
    } else if (user.role === 'preceptor') {
        materiasToShow = materias.filter(m => user.cursos.includes(m.curso));
    }

    if (user.role === 'profesor') {
        // Vista del profesor
        return generateProfesorNotasHTML(materiasToShow, notas, usuarios);
    } else if (user.role === 'preceptor') {
        // Vista del preceptor
        return generatePreceptorNotasHTML(materiasToShow, notas, usuarios);
    }

    // Vista del alumno
    const notasAlumno = notas.filter(n => n.alumnoId === user.id);
    const promedio = notasAlumno.reduce((sum, nota) => sum + nota.nota, 0) / notasAlumno.length;

    return `
        <div class="section-content">
            <div class="section-header">
                <h2><i class="fas fa-star"></i> Notas</h2>
                <div class="promedio-general">
                    <span class="promedio-label">Promedio General</span>
                    <span class="promedio-value ${getNotaBadgeClass(promedio)}">${promedio.toFixed(2)}</span>
                </div>
            </div>

            <div class="notas-grid">
                ${materias.map(materia => {
                    const materiasNotas = notas.filter(n => n.materiaId === materia.id);
                    const materiaPromedio = materiasNotas.length > 0 
                        ? materiasNotas.reduce((sum, n) => sum + n.nota, 0) / materiasNotas.length 
                        : null;

                    return `
                        <div class="nota-card">
                            <div class="nota-card-header">
                                <h3>${materia.nombre}</h3>
                                ${materiaPromedio !== null ? `
                                    <div class="promedio-materia ${getNotaBadgeClass(materiaPromedio)}">
                                        ${materiaPromedio.toFixed(2)}
                                    </div>
                                ` : ''}
                            </div>
                            <div class="nota-card-body">
                                ${materiasNotas.length > 0 ? `
                                    <div class="notas-list">
                                        ${materiasNotas.map(nota => `
                                            <div class="nota-item">
                                                <div class="nota-info">
                                                    <div class="nota-tipo">${nota.tipo}</div>
                                                    <div class="nota-fecha">${formatDate(nota.fecha)}</div>
                                                </div>
                                                <div class="nota-valor ${getNotaBadgeClass(nota.nota)}">
                                                    ${nota.nota.toFixed(1)}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : `
                                    <div class="no-notas">
                                        <i class="fas fa-info-circle"></i>
                                        <span>No hay notas registradas</span>
                                    </div>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Get estado badge class
function getEstadoBadgeClass(estado) {
    switch (estado.toLowerCase()) {
        case 'presente':
            return 'badge-success';
        case 'tarde':
            return 'badge-warning';
        case 'ausente':
            return 'badge-danger';
        default:
            return 'badge-secondary';
    }
}

// Get estado icon
function getEstadoIcon(estado) {
    switch (estado.toLowerCase()) {
        case 'presente':
            return 'fas fa-check';
        case 'tarde':
            return 'fas fa-clock';
        case 'ausente':
            return 'fas fa-times';
        default:
            return 'fas fa-question';
    }
}

// Generate Asistencia HTML
function generateAsistenciaHTML() {
    const asistencias = app.data.asistencias;
    const materias = app.data.materias;

    // Calcular porcentaje de asistencia
    const totalClases = asistencias.length;
    const presentes = asistencias.filter(a => a.estado.toLowerCase() === 'presente' || a.estado.toLowerCase() === 'tarde').length;
    const porcentajeAsistencia = (presentes / totalClases) * 100;

    return `
        <div class="section-content">
            <div class="section-header">
                <h2><i class="fas fa-calendar-check"></i> Asistencia</h2>
                <div class="asistencia-stats">
                    <div class="stat-item ${getEstadoBadgeClass(porcentajeAsistencia >= 80 ? 'presente' : 'ausente')}">
                        <span class="stat-label">Porcentaje de Asistencia</span>
                        <span class="stat-value">${porcentajeAsistencia.toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            <div class="asistencia-grid">
                ${materias.map(materia => {
                    const materiaAsistencias = asistencias.filter(a => a.materiaId === materia.id);
                    const materiaPorcentaje = materiaAsistencias.length > 0 
                        ? (materiaAsistencias.filter(a => a.estado.toLowerCase() === 'presente' || a.estado.toLowerCase() === 'tarde').length / materiaAsistencias.length) * 100 
                        : 0;

                    return `
                        <div class="asistencia-card">
                            <div class="asistencia-card-header">
                                <h3>${materia.nombre}</h3>
                                <div class="asistencia-porcentaje ${getEstadoBadgeClass(materiaPorcentaje >= 80 ? 'presente' : 'ausente')}">
                                    ${materiaPorcentaje.toFixed(1)}%
                                </div>
                            </div>
                            <div class="asistencia-card-body">
                                ${materiaAsistencias.length > 0 ? `
                                    <div class="asistencias-list">
                                        ${materiaAsistencias.map(asistencia => `
                                            <div class="asistencia-item">
                                                <div class="asistencia-fecha">
                                                    ${formatDate(asistencia.fecha)}
                                                </div>
                                                <div class="asistencia-estado ${getEstadoBadgeClass(asistencia.estado)}">
                                                    <i class="${getEstadoIcon(asistencia.estado)}"></i>
                                                    ${asistencia.estado.charAt(0).toUpperCase() + asistencia.estado.slice(1)}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                ` : `
                                    <div class="no-asistencias">
                                        <i class="fas fa-info-circle"></i>
                                        <span>No hay registros de asistencia</span>
                                    </div>
                                `}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Función para generar vista de notas del profesor
function generateProfesorNotasHTML(materias, notas, usuarios) {
    return `
        <div class="section-content">
            <div class="section-header">
                <h2><i class="fas fa-pen"></i> Gestión de Notas</h2>
                <button class="btn-primary">
                    <i class="fas fa-plus"></i> Cargar Nueva Nota
                </button>
            </div>
            <div class="notas-grid">
                ${materias.map(materia => {
                    const materiasNotas = notas.filter(n => n.materiaId === materia.id);
                    const alumnosEnMateria = usuarios.filter(u => u.rol === 'alumno' && u.curso === materia.curso);
                    const promedioMateria = materiasNotas.length > 0 
                        ? materiasNotas.reduce((sum, n) => sum + n.nota, 0) / materiasNotas.length 
                        : 0;

                    return `
                        <div class="nota-card">
                            <div class="nota-card-header">
                                <h3>${materia.nombre}</h3>
                                <div class="stats-badge ${getNotaBadgeClass(promedioMateria)}">
                                    Promedio: ${promedioMateria.toFixed(2)}
                                </div>
                            </div>
                            <div class="nota-card-body">
                                <div class="profesor-stats">
                                    <div class="stat-row">
                                        <span>Total Alumnos</span>
                                        <span>${alumnosEnMateria.length}</span>
                                    </div>
                                    <div class="stat-row">
                                        <span>Evaluaciones Tomadas</span>
                                        <span>${new Set(materiasNotas.map(n => n.tipo)).size}</span>
                                    </div>
                                    <div class="stat-row">
                                        <span>Alumnos Aprobados</span>
                                        <span>${materiasNotas.filter(n => n.nota >= 6).length}</span>
                                    </div>
                                </div>
                                <div class="action-buttons">
                                    <button class="btn-secondary">
                                        <i class="fas fa-list"></i> Ver Detalle
                                    </button>
                                    <button class="btn-secondary">
                                        <i class="fas fa-file-export"></i> Exportar
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Función para generar vista de notas del preceptor
function generatePreceptorNotasHTML(materias, notas, usuarios) {
    return `
        <div class="section-content">
            <div class="section-header">
                <h2><i class="fas fa-chart-bar"></i> Rendimiento Académico</h2>
                <div class="filter-controls">
                    <select class="form-control">
                        <option value="">Todos los Cursos</option>
                        ${new Set(materias.map(m => m.curso)).size > 0 ? 
                            Array.from(new Set(materias.map(m => m.curso))).map(curso => 
                                `<option value="${curso}">${curso}</option>`
                            ).join('') : ''
                        }
                    </select>
                </div>
            </div>
            <div class="rendimiento-grid">
                ${materias.map(materia => {
                    const materiasNotas = notas.filter(n => n.materiaId === materia.id);
                    const alumnosEnMateria = usuarios.filter(u => u.rol === 'alumno' && u.curso === materia.curso);
                    const promedioMateria = materiasNotas.length > 0 
                        ? materiasNotas.reduce((sum, n) => sum + n.nota, 0) / materiasNotas.length 
                        : 0;
                    const alumnosEnRiesgo = materiasNotas.filter(n => n.nota < 4).length;

                    return `
                        <div class="rendimiento-card">
                            <div class="rendimiento-card-header">
                                <div class="header-info">
                                    <h3>${materia.nombre}</h3>
                                    <span class="curso-badge">${materia.curso}</span>
                                </div>
                                <div class="promedio ${getNotaBadgeClass(promedioMateria)}">
                                    ${promedioMateria.toFixed(2)}
                                </div>
                            </div>
                            <div class="rendimiento-card-body">
                                <div class="estadisticas">
                                    <div class="stat-item">
                                        <span class="stat-label">Total Alumnos</span>
                                        <span class="stat-value">${alumnosEnMateria.length}</span>
                                    </div>
                                    <div class="stat-item ${alumnosEnRiesgo > 0 ? 'warning' : ''}">
                                        <span class="stat-label">En Riesgo</span>
                                        <span class="stat-value">${alumnosEnRiesgo}</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Última Evaluación</span>
                                        <span class="stat-value">${
                                            materiasNotas.length > 0 
                                                ? formatDate(materiasNotas.sort((a,b) => new Date(b.fecha) - new Date(a.fecha))[0].fecha)
                                                : 'Sin evaluaciones'
                                        }</span>
                                    </div>
                                </div>
                                <button class="btn-secondary btn-block">
                                    <i class="fas fa-file-alt"></i> Ver Informe Detallado
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// Generate Perfil HTML
function generatePerfilHTML() {
    if (!app.currentUser) return '';
    
    const user = app.currentUser;
    const materias = app.data.materias;
    const notas = app.data.notas;
    const asistencias = app.data.asistencias;

    let roleSpecificInfo = '';

    switch(user.role) {
        case 'profesor':
            const materiasProfesor = materias.filter(m => user.materias.includes(m.id));
            const totalAlumnos = new Set(notas.filter(n => user.materias.includes(n.materiaId)).map(n => n.alumnoId)).size;
            roleSpecificInfo = `
                <div class="stats-section">
                    <h3>Información Académica</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <i class="fas fa-chalkboard-teacher"></i>
                            <span class="stat-value">${materiasProfesor.length}</span>
                            <span class="stat-label">Materias a Cargo</span>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-users"></i>
                            <span class="stat-value">${totalAlumnos}</span>
                            <span class="stat-label">Alumnos Totales</span>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-clock"></i>
                            <span class="stat-value">${materiasProfesor.reduce((acc, m) => acc + 4, 0)}</span>
                            <span class="stat-label">Horas Semanales</span>
                        </div>
                    </div>
                    <div class="materias-list">
                        ${materiasProfesor.map(m => `
                            <div class="materia-item">
                                <span class="materia-nombre">${m.nombre}</span>
                                <span class="materia-horario">${m.horario}</span>
                                <span class="materia-aula">Aula ${m.aula}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            break;

        case 'preceptor':
            const cursosPreceptor = user.cursos;
            const alumnosTotales = app.data.usuarios.filter(u => u.rol === 'alumno' && cursosPreceptor.includes(u.curso)).length;
            const asistenciasHoy = asistencias.filter(a => 
                new Date(a.fecha).toDateString() === new Date().toDateString() &&
                cursosPreceptor.includes(materias.find(m => m.id === a.materiaId)?.curso)
            ).length;
            
            roleSpecificInfo = `
                <div class="stats-section">
                    <h3>Gestión de Cursos</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <i class="fas fa-user-graduate"></i>
                            <span class="stat-value">${alumnosTotales}</span>
                            <span class="stat-label">Alumnos a Cargo</span>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-chalkboard"></i>
                            <span class="stat-value">${cursosPreceptor.length}</span>
                            <span class="stat-label">Cursos Asignados</span>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-clipboard-check"></i>
                            <span class="stat-value">${asistenciasHoy}</span>
                            <span class="stat-label">Asistencias Hoy</span>
                        </div>
                    </div>
                    <div class="cursos-list">
                        ${cursosPreceptor.map(cursoId => {
                            const alumnosCurso = app.data.usuarios.filter(u => u.rol === 'alumno' && u.curso === cursoId).length;
                            return `
                                <div class="curso-item">
                                    <div class="curso-info">
                                        <span class="curso-nombre">${cursoId}</span>
                                        <span class="curso-alumnos">${alumnosCurso} alumnos</span>
                                    </div>
                                    <button class="btn-secondary btn-sm">
                                        <i class="fas fa-clipboard-list"></i> Ver Detalles
                                    </button>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
            break;

        case 'alumno':
            const promedioGeneral = notas.filter(n => n.alumnoId === user.id)
                .reduce((sum, nota) => sum + nota.nota, 0) / notas.filter(n => n.alumnoId === user.id).length;
            const asistenciaTotal = asistencias.filter(a => a.alumnoId === user.id).length;
            const asistenciaPresente = asistencias.filter(a => a.alumnoId === user.id && a.estado === 'presente').length;
            
            roleSpecificInfo = `
                <div class="stats-section">
                    <h3>Rendimiento Académico</h3>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <i class="fas fa-star"></i>
                            <span class="stat-value">${promedioGeneral.toFixed(2)}</span>
                            <span class="stat-label">Promedio General</span>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-calendar-check"></i>
                            <span class="stat-value">${((asistenciaPresente/asistenciaTotal) * 100).toFixed(1)}%</span>
                            <span class="stat-label">Asistencia</span>
                        </div>
                        <div class="stat-card">
                            <i class="fas fa-book"></i>
                            <span class="stat-value">${materias.filter(m => m.curso === user.curso).length}</span>
                            <span class="stat-label">Materias Cursando</span>
                        </div>
                    </div>
                </div>
            `;
            break;
    }

    return `
        <div class="section-content">
            <div class="perfil-header">
                <i class="fas fa-user-circle"></i>
                <h2>Mi Perfil</h2>
            </div>
            <div class="perfil-card">
                <div class="perfil-info">
                    <div class="info-item">
                        <i class="fas fa-user"></i>
                        <div class="info-content">
                            <label>Nombre</label>
                            <span>${user.name}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-envelope"></i>
                        <div class="info-content">
                            <label>Email</label>
                            <span>${user.email}</span>
                        </div>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-user-tag"></i>
                        <div class="info-content">
                            <label>Rol</label>
                            <span>${user.role.charAt(0).toUpperCase() + user.role.slice(1)}</span>
                        </div>
                    </div>
                    ${user.curso ? `
                        <div class="info-item">
                            <i class="fas fa-graduation-cap"></i>
                            <div class="info-content">
                                <label>Curso</label>
                                <span>${user.curso}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
                ${roleSpecificInfo}
            </div>
        </div>
    `;
}