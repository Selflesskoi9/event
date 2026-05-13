// ========== ДАННЫЕ СОБЫТИЙ (Startup Pitch Night УДАЛЕН) ==========
const EVENTS_DATA = [
    {
        id: 1,
        title: "Tech Conference 2026",
        description: "Крупнейшая конференция о технологиях будущего. Искусственный интеллект, блокчейн, квантовые вычисления.",
        date: "2026-06-15",
        time: "10:00",
        location: "Москва, Крокус Экспо",
        category: "Конференция",
        image: "🎤",
        price: "free",
        registrations: 0
    },
    {
        id: 2,
        title: "Summer Music Festival",
        description: "Открытый фестиваль электронной музыки с участием лучших диджеев страны.",
        date: "2026-07-20",
        time: "14:00",
        location: "Москва, Парк Горького",
        category: "Фестиваль",
        image: "🎵",
        price: "free",
        registrations: 0
    },
    {
        id: 3,
        title: "UX/UI Design Masterclass",
        description: "Интенсив по современному веб-дизайну. Создание интерфейсов, прототипирование, тренды 2026.",
        date: "2026-05-28",
        time: "11:00",
        location: "Онлайн",
        category: "Мастер-класс",
        image: "🎨",
        price: "free",
        registrations: 0
    },
    {
        id: 5,
        title: "AI & Machine Learning Workshop",
        description: "Практический воркшоп по машинному обучению. Построение моделей, нейронные сети.",
        date: "2026-06-25",
        time: "15:00",
        location: "Онлайн",
        category: "Воркшоп",
        image: "🤖",
        price: "free",
        registrations: 0
    },
    {
        id: 6,
        title: "Art & Wine Evening",
        description: "Вечер живописи и вина. Создайте свою картину в компании единомышленников.",
        date: "2026-06-12",
        time: "18:30",
        location: "Москва, Арт-пространство 'Зарядье'",
        category: "Арт-вечер",
        image: "🎨",
        price: "free",
        registrations: 0
    }
];

// ========== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ==========
let events = [...EVENTS_DATA];
let currentEventId = null;

// ========== ЗАГРУЗКА ДАННЫХ ==========
function loadData() {
    const savedRegistrations = localStorage.getItem('eventhub_registrations');
    if (savedRegistrations) {
        const registrations = JSON.parse(savedRegistrations);
        events.forEach(event => event.registrations = 0);
        registrations.forEach(reg => {
            const event = events.find(e => e.id === reg.eventId);
            if (event) {
                event.registrations = (event.registrations || 0) + 1;
            }
        });
    }
    updateStatsCounters();
}

// ========== АНИМАЦИЯ ОБНОВЛЕНИЯ ==========
function animateNumberUpdate(element) {
    if (!element) return;
    element.classList.add('updating');
    setTimeout(() => element.classList.remove('updating'), 500);
}

function updateStatsCountersWithAnimation() {
    const totalEventsElement = document.getElementById('heroTotalEvents');
    const totalRegistrationsElement = document.getElementById('heroTotalRegistrations');
    
    const totalReg = events.reduce((sum, e) => sum + (e.registrations || 0), 0);
    
    if (totalEventsElement) {
        animateNumberUpdate(totalEventsElement);
        totalEventsElement.textContent = events.length;
    }
    
    if (totalRegistrationsElement) {
        animateNumberUpdate(totalRegistrationsElement);
        totalRegistrationsElement.textContent = totalReg;
    }
}

function updateStatsCounters() {
    const totalEventsElement = document.getElementById('heroTotalEvents');
    const totalRegistrationsElement = document.getElementById('heroTotalRegistrations');
    
    const totalReg = events.reduce((sum, e) => sum + (e.registrations || 0), 0);
    
    if (totalEventsElement) totalEventsElement.textContent = events.length;
    if (totalRegistrationsElement) totalRegistrationsElement.textContent = totalReg;
}

// ========== ОТОБРАЖЕНИЕ СОБЫТИЙ ==========
function displayEvents() {
    const eventsGrid = document.getElementById('eventsGrid');
    if (!eventsGrid) return;
    
    eventsGrid.innerHTML = events.map(event => `
        <div class="event-card" data-event-id="${event.id}">
            <div class="event-card__date">
                <i class="far fa-calendar-alt"></i> ${formatDate(event.date)}
            </div>
            <div class="event-card__content">
                <div class="event-card__title">
                    <span style="font-size: 32px; margin-right: 12px;">${event.image}</span>
                    ${event.title}
                </div>
                <p class="event-card__desc">${event.description}</p>
                <div class="event-card__meta">
                    <span><i class="far fa-clock"></i> ${event.time}</span>
                    <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                    <span><i class="fas fa-tag"></i> ${event.category}</span>
                </div>
                <button class="btn btn--primary event-card__btn" onclick="openRegisterModal(${event.id})">
                    Зарегистрироваться <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// ========== ФОРМАТИРОВАНИЕ ==========
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ========== МОДАЛЬНЫЕ ОКНА ==========
function openRegisterModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    
    currentEventId = eventId;
    document.getElementById('modalEventName').textContent = event.title;
    document.getElementById('eventId').value = eventId;
    document.getElementById('registerModal').classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('registerModal');
    if (modal) modal.classList.remove('active');
    const form = document.getElementById('registerForm');
    if (form) form.reset();
    const messageDiv = document.getElementById('registerMessage');
    if (messageDiv) {
        messageDiv.classList.remove('success', 'error');
        messageDiv.style.display = 'none';
    }
}

function openSuccessModal() {
    closeModal();
    const successModal = document.getElementById('successModal');
    if (successModal) successModal.classList.add('active');
}

function closeSuccessModal() {
    const successModal = document.getElementById('successModal');
    if (successModal) successModal.classList.remove('active');
}

// ========== РЕГИСТРАЦИЯ ==========
async function submitRegistration(eventData) {
    const registrations = JSON.parse(localStorage.getItem('eventhub_registrations') || '[]');
    
    const existing = registrations.find(r => r.email === eventData.email && r.eventId === eventData.eventId);
    if (existing) {
        throw new Error('Вы уже зарегистрированы на это событие!');
    }
    
    registrations.push({
        id: Date.now(),
        ...eventData,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('eventhub_registrations', JSON.stringify(registrations));
    
    const event = events.find(e => e.id === eventData.eventId);
    if (event) {
        event.registrations = (event.registrations || 0) + 1;
    }
    
    updateStatsCountersWithAnimation();
    displayEvents();
    
    return true;
}

// ========== ОБРАБОТЧИКИ ==========
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    displayEvents();
    
    // Форма регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('regName')?.value.trim();
            const email = document.getElementById('regEmail')?.value.trim();
            const phone = document.getElementById('regPhone')?.value.trim();
            const eventId = parseInt(document.getElementById('eventId')?.value);
            const messageDiv = document.getElementById('registerMessage');
            
            if (!name || name.length < 2) {
                showMessage(messageDiv, 'Введите корректное имя', 'error');
                return;
            }
            
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage(messageDiv, 'Введите корректный email', 'error');
                return;
            }
            
            try {
                await submitRegistration({ name, email, phone, eventId });
                openSuccessModal();
                registerForm.reset();
            } catch (error) {
                showMessage(messageDiv, error.message, 'error');
            }
        });
    }
    
    // Контактная форма
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contactName')?.value.trim();
            const email = document.getElementById('contactEmail')?.value.trim();
            const message = document.getElementById('contactMessage')?.value.trim();
            const messageDiv = document.getElementById('contactFormMessage');
            
            if (!name || !email || !message) {
                showMessage(messageDiv, 'Заполните все поля', 'error');
                return;
            }
            
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage(messageDiv, 'Введите корректный email', 'error');
                return;
            }
            
            showMessage(messageDiv, 'Сообщение отправлено! Мы свяжемся с вами.', 'success');
            contactForm.reset();
        });
    }
    
    // Мобильное меню
    const mobileBtn = document.getElementById('mobileMenuBtn');
    if (mobileBtn) {
        mobileBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Закрытие модальных окон
    window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    };
});

function showMessage(element, text, type) {
    if (element) {
        element.textContent = text;
        element.className = `form-message ${type}`;
        element.style.display = 'block';
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.toggle('active');
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    if (menu) menu.classList.remove('active');
}