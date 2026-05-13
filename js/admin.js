// ========== ЗАГРУЗКА РЕГИСТРАЦИЙ ==========
let allRegistrations = [];
let currentFilter = '';
let currentPage = 1;
const itemsPerPage = 10;

function loadRegistrations() {
    const saved = localStorage.getItem('eventhub_registrations');
    allRegistrations = saved ? JSON.parse(saved) : [];
    
    // Добавляем названия событий
    const events = JSON.parse(localStorage.getItem('eventhub_events') || '[]');
    allRegistrations = allRegistrations.map(reg => {
        const event = events.find(e => e.id === reg.eventId);
        return { ...reg, eventTitle: event?.title || 'Событие удалено' };
    });
    
    displayStats();
    displayRegistrations();
}

function displayStats() {
    const statsContainer = document.getElementById('statsCards');
    if (!statsContainer) return;
    
    const totalRegistrations = allRegistrations.length;
    const uniqueUsers = [...new Set(allRegistrations.map(r => r.email))].length;
    
    // Подсчет по событиям
    const eventsCount = {};
    allRegistrations.forEach(reg => {
        eventsCount[reg.eventTitle] = (eventsCount[reg.eventTitle] || 0) + 1;
    });
    const topEvent = Object.entries(eventsCount).sort((a,b) => b[1] - a[1])[0];
    
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
            <i class="fas fa-fire"></i>
            <div class="stat-card__number">${topEvent ? topEvent[1] : 0}</div>
            <div class="stat-card__label">${topEvent ? topEvent[0].slice(0, 20) : 'Нет данных'}</div>
        </div>
    `;
}

function displayRegistrations() {
    const tbody = document.getElementById('registrationsTableBody');
    if (!tbody) return;
    
    let filtered = allRegistrations;
    if (currentFilter) {
        filtered = allRegistrations.filter(r => 
            r.name.toLowerCase().includes(currentFilter) ||
            r.email.toLowerCase().includes(currentFilter) ||
            (r.eventTitle && r.eventTitle.toLowerCase().includes(currentFilter))
        );
    }
    
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const start = (currentPage - 1) * itemsPerPage;
    const pageItems = filtered.slice(start, start + itemsPerPage);
    
    if (pageItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">Нет регистраций</td></tr>';
    } else {
        tbody.innerHTML = pageItems.map(reg => `
            <tr data-id="${reg.id}">
                <td>${formatAdminDate(reg.createdAt)}</td>
                <td>${escapeHtml(reg.name)}</td>
                <td>${escapeHtml(reg.email)}</td>
                <td>${reg.phone || '—'}</td>
                <td>${escapeHtml(reg.eventTitle)}</td>
                <td><button class="delete-btn" onclick="deleteRegistration(${reg.id})"><i class="fas fa-trash-alt"></i></button></td>
            </tr>
        `).join('');
    }
    
    displayPagination(totalPages);
}

function displayPagination(totalPages) {
    const paginationDiv = document.getElementById('pagination');
    if (!paginationDiv) return;
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }
    
    let html = '<button class="page-btn" onclick="changePage(1)">«</button>';
    for (let i = 1; i <= Math.min(totalPages, 5); i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
    }
    if (totalPages > 5) {
        html += '<span>...</span>';
        html += `<button class="page-btn" onclick="changePage(${totalPages})">${totalPages}</button>`;
    }
    html += `<button class="page-btn" onclick="changePage(${totalPages})">»</button>`;
    paginationDiv.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    displayRegistrations();
}

function formatAdminDate(dateString) {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute:'2-digit'});
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

function deleteRegistration(id) {
    currentDeleteId = id;
    document.getElementById('deleteModal').classList.add('active');
}

let currentDeleteId = null;

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
});

function refreshData() {
    loadRegistrations();
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function exportToExcel() {
    if (allRegistrations.length === 0) {
        alert('Нет данных для экспорта');
        return;
    }
    
    let csvContent = "\uFEFFID,Дата,Имя,Email,Телефон,Событие\n";
    allRegistrations.forEach(reg => {
        csvContent += `${reg.id},${reg.createdAt || ''},${reg.name},${reg.email},${reg.phone || ''},${reg.eventTitle}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', 'registrations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}