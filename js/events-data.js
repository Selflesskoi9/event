// ========== ЕДИНЫЙ ФАЙЛ СОБЫТИЙ ==========
const EVENTS_DATA = [
    { id: 1, title: "Tech Conference 2026" },
    { id: 2, title: "Summer Music Festival" },
    { id: 3, title: "UX/UI Design Masterclass" },
    { id: 4, title: "Startup Pitch Night" },
    { id: 5, title: "AI & Machine Learning Workshop" },
    { id: 6, title: "Art & Wine Evening" }
];

// Функция получения названия события
function getEventTitle(eventId) {
    const event = EVENTS_DATA.find(e => e.id === eventId);
    return event ? event.title : `⚠️ Событие удалено (ID: ${eventId})`;
}