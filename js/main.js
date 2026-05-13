// ========== ДАННЫЕ СОБЫТИЙ ==========
let events = [
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
        id: 4,
        title: "Startup Pitch Night",
        description: "Вечер стартапов. Возможность презентовать свой проект инвесторам и получить обратную связь.",
        date: "2026-06-05",
        time: "19:00",
        location: "Москва, Digital October",
        category: "Нетворкинг",
        image: "🚀",
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

// ========== ЗАГРУЗКА ДАННЫХ ИЗ LOCALSTORAGE ==========
function loadData() {
    const savedRegistrations = localStorage.getItem('eventhub_registrations');
    if (savedRegistrations) {
        const registrations = JSON.parse(savedRegistrations);
        // Сбрасываем счетчики
        events.forEach(event => event.registrations = 0);
        // Подсчитываем регистрации
        registrations.forEach(reg => {
            const event = events.find(e => e.id === reg.eventId);
            if (event) {
                event.registrations = (event.registrations || 0) + 1;
            }
        });
    }
    updateStatsCounters();
}

// ========== АНИМАЦИЯ ОБНОВЛЕНИЯ ЦИФР ==========
function animateNumberUpdate(element) {
    if (!element) return;
    
    // Добавляем класс анимации
    element.classList.add('updating');
    
    // Удаляем класс через 0.5 секунды
    setTimeout(() => {
        element.classList.remove('updating');
    }, 500);
}

function updateStatsCountersWithAnimation() {
    // Анимируем все цифры на странице
    const totalEventsElement = document.getElementById('totalEvents');
    const totalRegistrationsElement = document.getElementById('totalRegistrations');
    const heroStatsNumbers = document.querySelectorAll('.hero__stat-number');
    const statCardNumbers = document.querySelectorAll('.stat-card__number');
    
    // Обновляем и анимируем каждую цифру
    if (totalEventsElement) {
        animateNumberUpdate(totalEventsElement);
        totalEventsElement.textContent = events.length;
    }
    
    if (totalRegistrationsElement) {
        const totalReg = events.reduce((sum, e) => sum + (e.registrations || 0), 0);
        animateNumberUpdate(totalRegistrationsElement);
        totalRegistrationsElement.textContent = totalReg;
    }
    
    // Обновляем hero статистику, если есть
    heroStatsNumbers.forEach(el => {
        animateNumberUpdate(el);
        if (el.id === 'heroTotalEvents') {
            el.textContent = events.length;
        } else if (el.id === 'heroTotalRegistrations') {
            const totalReg = events.reduce((sum, e) => sum + (e.registrations || 0), 0);
            el.textContent = totalReg;
        }
    });
    
    // Обновляем карточки статистики
    statCardNumbers.forEach(el => {
        animateNumberUpdate(el);
        if (el.id === 'statTotalEvents') {
            el.textContent = events.length;
        } else if (el.id === 'statTotalRegistrations') {
            const totalReg = events.reduce((sum, e) => sum + (e.registrations || 0), 0);
            el.textContent = totalReg;
        }
    });
}

function updateStatsCounters() {
    const totalEventsElement = document.getElementById('totalEvents');
    const totalRegistrationsElement = document.getElementById('totalRegistrations');
    const heroTotalEvents = document.getElementById('heroTotalEvents');
    const heroTotalRegistrations = document.getElementById('heroTotalRegistrations');
    const statTotalEvents = document.getElementById('statTotalEvents');
    const statTotalRegistrations = document.getElementById('statTotalRegistrations');
    
    const totalReg = events.reduce((sum, e) => sum + (e.registrations || 0), 0);
    
    if (totalEventsElement) totalEventsElement.textContent = events.length;
    if (totalRegistrationsElement) totalRegistrationsElement.textContent = totalReg;
    if (heroTotalEvents) heroTotalEvents.textContent = events.length;
    if (heroTotalRegistrations) heroTotalRegistrations.textContent = totalReg;
    if (statTotalEvents) statTotalEvents.textContent = events.length;
    if (statTotalRegistrations) statTotalRegistrations.textContent = totalReg;
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

// ========== ФОРМАТИРОВАНИЕ ДАТЫ ==========
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// ========== МОДАЛЬНЫЕ ОКНА ==========
let currentEventId = null;

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

// ========== РЕГИСТРАЦИЯ С АНИМАЦИЕЙ ==========
async function submitRegistration(eventData) {
    const registrations = JSON.parse(localStorage.getItem('eventhub_registrations') || '[]');
    
    // Проверка на дубликат
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
    
    // Обновляем счетчик регистраций у события
    const event = events.find(e => e.id === eventData.eventId);
    if (event) {
        event.registrations = (event.registrations || 0) + 1;
    }
    
    // ОБНОВЛЯЕМ ЦИФРЫ С АНИМАЦИЕЙ!
    updateStatsCountersWithAnimation();
    
    // Обновляем отображение событий
    displayEvents();
    
    // Отправка данных в Google Sheets (опционально)
    await sendToGoogleSheets(eventData);
    
    return true;
}

// ========== ОТПРАВКА ДАННЫХ В GOOGLE SHEETS ==========
async function sendToGoogleSheets(registration) {
    const event = events.find(e => e.id === registration.eventId);
    if (!event) return;
    
    const dataToSend = {
        name: registration.name,
        email: registration.email,
        phone: registration.phone || '',
        eventName: event.title,
        eventDate: formatDate(event.date),
        eventTime: event.time,
        eventLocation: event.location,
        registeredAt: new Date().toLocaleString('ru-RU')
    };
    
    try {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbx0bqpodYiWDcz1PdHu1EpW1yW7Nwo7LaA7rtT63J5we6LOfQua7hwIlVR3YIQiFAwNyw/exec';
        
        await fetch(scriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });
        console.log('✅ Данные отправлены в Google Sheets');
    } catch (error) {
        console.log('❌ Ошибка отправки в Google Sheets:', error);
    }
}

// ========== ОБРАБОТЧИК ФОРМЫ РЕГИСТРАЦИИ ==========
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    displayEvents();
    
    // Обновляем статистику при загрузке
    setTimeout(() => {
        updateStatsCounters();
    }, 100);
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('regName')?.value.trim();
            const email = document.getElementById('regEmail')?.value.trim();
            const phone = document.getElementById('regPhone')?.value.trim();
            const eventId = parseInt(document.getElementById('eventId')?.value);
            const messageDiv = document.getElementById('registerMessage');
            
            // Валидация
            if (!name || name.length < 2) {
                showMessage(messageDiv, 'Введите корректное имя', 'error');
                return;
            }
            
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showMessage(messageDiv, 'Введите корректный email', 'error');
                return;
            }
            
            if (phone && !/^[\d\s\+\(\)-]{10,}$/.test(phone)) {
                showMessage(messageDiv, 'Введите корректный телефон (10+ цифр)', 'error');
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
    
    // Закрытие модальных окон по клику вне
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
    let menu = document.querySelector('.mobile-menu');
    if (!menu) {
        menu = document.createElement('div');
        menu.className = 'mobile-menu';
        menu.innerHTML = `
            <ul>
                <li><a href="#events" onclick="closeMobileMenu()">События</a></li>
                <li><a href="#about" onclick="closeMobileMenu()">О нас</a></li>
                <li><a href="#contact" onclick="closeMobileMenu()">Контакты</a></li>
                <li><a href="admin.html" onclick="closeMobileMenu()">Админ</a></li>
            </ul>
        `;
        document.body.appendChild(menu);
    }
    menu.classList.toggle('active');
}

function closeMobileMenu() {
    const menu = document.querySelector('.mobile-menu');
    if (menu) menu.classList.remove('active');
}