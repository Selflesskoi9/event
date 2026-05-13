// ========== ДАННЫЕ СОБЫТИЙ (синхронизированы с main.js - Startup Pitch Night УДАЛЕН) ==========
const EVENTS_DATA = [
    { id: 1, title: "Tech Conference 2026" },
    { id: 2, title: "Summer Music Festival" },
    { id: 3, title: "UX/UI Design Masterclass" },
    { id: 5, title: "AI & Machine Learning Workshop" },
    { id: 6, title: "Art & Wine Evening" }
];

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let allRegistrations = [];
let currentFilter = '';
let currentPage = 1;
const itemsPerPage = 10;
let currentDeleteId = null;

// ========== ПОЛУЧЕНИЕ НАЗВАНИЯ СОБЫТИЯ ==========
function getEventTitle(eventId) {
    const event = EVENTS_DATA.find(e => e.id === eventId);
    if (event) return event.title;
    
    // Пробуем найти в localStorage
    const savedEvents = localStorage.getItem('eventhub_events');
    if (savedEvents) {
        const events = JSON.parse(savedEvents);
        const found = events.find(e => e.id === eventId);
        if (found) return found.title;
    }
    
    return `⚠️ Событие удалено (ID: ${eventId})`;
}

// ========== ЗАГРУЗКА РЕГИСТРАЦИЙ ==========
function loadRegistrations() {
    const saved = localStorage.getItem('eventhub_registrations');
    allRegistrations = saved ? JSON.parse(saved) : [];
    
    allRegistrations = allRegistrations.map(reg => ({
        ...reg,
        eventTitle: getEventTitle(reg.eventId)
    }));
    
    allRegistrations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    displayStats();
    displayRegistrations();
}

// ========== СТАТИСТИКА ==========
function displayStats() {
    const statsContainer = document.getElementById('statsCards');
    if (!statsContainer) return;
    
    const totalRegistrations = allRegistrations.length;
    const uniqueUsers = [...new Set(allRegistrations.map(r => r.email))].length;
    
    const eventsCount = {};
    allRegistrations.forEach(reg => {
        eventsCount[reg.eventTitle] = (eventsCount[reg.eventTitle] || 0) + 1;
    });
    
    const topEvent = Object.entries(eventsCount).sort((a, b) => b[1] - a[1])[0];
    
    statsContainer.innerHTML = `
        <div class="stat-card">
            <i class="fas fa-users"></i>
            <div class="stat-card__number">${totalRegistrations}</div>
            <div class="stat-card__label">Всего регистраций</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-user-check"></i>
            <div class="stat-card__number">${uniqueUsers}</div>
            <div class="stat-card__label">Уникальных участников</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-calendar-alt"></i>
            <div class="stat-card__number">${EVENTS_DATA.length}</div>
            <div class="stat-card__label">Всего событий</div>
        </div>
        <div class="stat-card">
            <i class="fas fa-trophy"></i>
            <div class="stat-card__number">${topEvent ? topEvent[1] : 0}</div>
            <div class="stat-card__label">${topEvent ? (topEvent[0].length > 20 ? topEvent[0].slice(0, 20) + '...' : topEvent[0]) : 'Нет данных'}</div>
        </div>
    `;
}

// ========== ОТОБРАЖЕНИЕ ТАБЛИЦЫ ==========
function displayRegistrations() {
    const tbody = document.getElementById('registrationsTableBody');
    if (!tbody) return;
    
    let filtered = allRegistrations;
    if (currentFilter) {
        filtered = allRegistrations.filter(r => 
            r.name.toLowerCase().includes(currentFilter) ||
            r.email.toLowerCase().includes(currentFilter) ||
            r.eventTitle.toLowerCase().includes(currentFilter)
        );
    }
    
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(start, start + itemsPerPage);
    
    if (pageItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Нет регистраций</td></tr>';
    } else {
        tbody.innerHTML = pageItems.map(reg => {
            const isDeleted = reg.eventTitle.includes('⚠️');
            const eventStyle = isDeleted ? 'style="color: #d63031; font-weight: 500;"' : '';
            
            return `
                <tr data-id="${reg.id}">
                    <td>${formatDate(reg.createdAt)}</td>
                    <td><strong>${escapeHtml(reg.name)}</strong></td>
                    <td>${escapeHtml(reg.email)}</td>
                    <td>${reg.phone || '—'}</td>
                    <td ${eventStyle}>${escapeHtml(reg.eventTitle)}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteRegistration(${reg.id})" title="Удалить">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    displayPagination(totalPages);
}

// ========== ПАГИНАЦИЯ ==========
function displayPagination(totalPages) {
    const paginationDiv = document.getElementById('pagination');
    if (!paginationDiv) return;
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let html = `<button class="page-btn" onclick="changePage(1)" ${currentPage === 1 ? 'disabled' : ''}>«</button>`;
    
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    
    html += `<button class="page-btn" onclick="changePage(${totalPages})" ${currentPage === totalPages ? 'disabled' : ''}>»</button>`;
    paginationDiv.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    displayRegistrations();
}

// ========== ФОРМАТИРОВАНИЕ ==========
function formatDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
}

function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ========== УДАЛЕНИЕ ==========
function deleteRegistration(id) {
    currentDeleteId = id;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
    currentDeleteId = null;
}

function refreshData() {
    loadRegistrations();
}

// ========== ЭКСПОРТ ==========
function exportToExcel() {
    if (allRegistrations.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }
    
    let csvContent = "\uFEFFID,Дата,Имя,Email,Телефон,Событие,Статус\n";
    
    allRegistrations.forEach(reg => {
        const isDeleted = reg.eventTitle.includes('⚠️');
        const status = isDeleted ? 'Событие удалено' : 'Активно';
        csvContent += `"${reg.id}","${reg.createdAt || ''}","${reg.name}","${reg.email}","${reg.phone || ''}","${reg.eventTitle}","${status}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', `registrations_${new Date().toISOString().slice(0,19)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`✅ Экспортировано ${allRegistrations.length} записей`);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    loadRegistrations();
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilter = e.target.value.toLowerCase();
            currentPage = 1;
            displayRegistrations();
        });
    }
    
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (currentDeleteId) {
                let registrations = JSON.parse(localStorage.getItem('eventhub_registrations') || '[]');
                registrations = registrations.filter(r => r.id !== currentDeleteId);
                localStorage.setItem('eventhub_registrations', JSON.stringify(registrations));
                
                closeModal('deleteModal');
                loadRegistrations();
                currentDeleteId = null;
            }
        });
    }
    
    window.onclick = function(event) {
        const modal = document.getElementById('deleteModal');
        if (event.target === modal) {
            closeModal('deleteModal');
        }
    };
});