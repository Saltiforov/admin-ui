class TimeoutService {
    constructor() {
        this.timeouts = new Map(); // Храним все таймауты
        this.isDisabled = false; // Флаг для отключения таймаутов
    }

    // ✅ Установка тайм-аута
    setTimeout(callback, delay) {
        if (this.isDisabled) return null; // Если отключены — не ставим таймер

        const id = setTimeout(() => {
            this.timeouts.delete(id); // Удаляем из списка после выполнения
            callback();
        }, delay);

        this.timeouts.set(id, id); // Добавляем в хранилище
        return id;
    }

    // ✅ Очистка конкретного тайм-аута
    clearTimeout(id) {
        if (this.timeouts.has(id)) {
            clearTimeout(this.timeouts.get(id));
            this.timeouts.delete(id);
        }
    }

    // ✅ Очистка всех тайм-аутов
    clearAllTimeouts() {
        this.timeouts.forEach((id) => clearTimeout(id));
        this.timeouts.clear();
    }

    // ✅ Полное отключение всех таймаутов
    disableTimeouts() {
        this.isDisabled = true;
        this.clearAllTimeouts(); // Чистим активные таймауты
    }

    // ✅ Включение таймаутов обратно
    enableTimeouts() {
        this.isDisabled = false;
    }
}

export const timeoutService = new TimeoutService();
