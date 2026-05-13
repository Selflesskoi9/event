// ========== ДАННЫЕ СОБЫТИЙ (синхронизированы с main.js) ==========
const EVENTS_DATA = [
    { id: 1, title: "Tech Conference 2026" },
    { id: 2, title: "Summer Music Festival" },
    { id: 3, title: "UX/UI Design Masterclass" },
    { id: 4, title: "Startup Pitch Night" },
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
    return event ? event.title : `⚠️ Событие удалено (ID: ${eventId})`;
}

// ========== ЗАГРУЗКА РЕГИСТРАЦИЙ ==========
function loadRegistrations() {
    const saved = localStorage.getItem('eventhub_registrations');
    allRegistrations = saved ? JSON.parse(saved) : [];
    
    // Добавляем названия событий (исправлено - теперь берем из EVENTS_DATA)
    allRegistrations = allRegistrations.map(reg => {
        return { 
            ...reg, 
            eventTitle: getEventTitle(reg.eventId)
        };
    });
    
    // Сортируем по дате (новые сверху)
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
    
    // Подсчет по событиям
    const eventsCount = {};
    allRegistrations.forEach(reg => {
        const title = reg.eventTitle;
        eventsCount[title] = (eventsCount[title] || 0) + 1;
    });
    
    const topEvent = Object.entries(eventsCount).sort((a, b) => b[1] - a[1])[0];
    const activeEventsCount = Object.keys(eventsCount).length;
    
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
            <div class="stat-card__number">${activeEventsCount}</div>
            <div class="stat-card__label">Событий с регистрациями</div>
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
    
    // Фильтрация
    let filtered = allRegistrations;
    if (currentFilter) {
        filtered = allRegistrations.filter(r => 
            r.name.toLowerCase().includes(currentFilter) ||
            r.email.toLowerCase().includes(currentFilter) ||
            (r.eventTitle && r.eventTitle.toLowerCase().includes(currentFilter))
        );
    }
    
    // Пагинация
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(start, start + itemsPerPage);
    
    // Отображение
    if (pageItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Нет регистраций</td></tr>';
    } else {
        tbody.innerHTML = pageItems.map(reg => {
            // Добавляем класс для удаленных событий
            const isDeleted = reg.eventTitle.includes('⚠️');
            const eventClass = isDeleted ? 'style="color: #d63031; font-weight: 500;"' : '';
            
            return `
                <tr data-id="${reg.id}">
                    <td>${formatAdminDate(reg.createdAt)}</td>
                    <td><strong>${escapeHtml(reg.name)}</strong></td>
                    <td>${escapeHtml(reg.email)}</td>
                    <td>${reg.phone || '—'}</td>
                    <td ${eventClass}>${escapeHtml(reg.eventTitle)}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteRegistration(${reg.id})" title="Удалить регистрацию">
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
    
    // Показываем до 5 страниц
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
function formatAdminDate(dateString) {
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

// ========== ОБНОВЛЕНИЕ ДАННЫХ ==========
function refreshData() {
    loadRegistrations();
}

// ========== ЭКСПОРТ В EXCEL/CSV ==========
function exportToExcel() {
    if (allRegistrations.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }
    
    let csvContent = "\uFEFFID,Дата регистрации,Имя,Email,Телефон,Событие,Статус события\n";
    
    allRegistrations.forEach(reg => {
        const isDeleted = reg.eventTitle.includes('⚠️');
        const status = isDeleted ? 'Удалено' : 'Активно';
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
    
    // Показываем уведомление
    alert(`✅ Экспортировано ${allRegistrations.length} записей`);
}

// ========== ИНИЦИАЛИЗАЦИЯ ==========
document.addEventListener('DOMContentLoaded', function() {
    loadRegistrations();
    
    // Поиск
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilter = e.target.value.toLowerCase();
            currentPage = 1;
            displayRegistrations();
        });
    }
    
    // Подтверждение удаления
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            if (currentDeleteId) {
                let registrations = JSON.parse(localStorage.getItem('eventhub_registrations') || '[]');
                const deletedReg = registrations.find(r => r.id === currentDeleteId);
                registrations = registrations.filter(r => r.id !== currentDeleteId);
                localStorage.setItem('eventhub_registrations', JSON.stringify(registrations));
                
                closeModal('deleteModal');
                loadRegistrations();
                
                // Показываем уведомление об успешном удалении
                if (deletedReg) {
                    console.log(`✅ Удалена регистрация: ${deletedReg.name} - ${deletedReg.email}`);
                }
                currentDeleteId = null;
            }
        });
    }
    
    // Закрытие модального окна по клику вне
    window.onclick = function(event) {
        const modal = document.getElementById('deleteModal');
        if (event.target === modal) {
            closeModal('deleteModal');
        }
    };
});