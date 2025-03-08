export function deepClone(obj) {
    if (Array.isArray(obj)) {
        return obj.map(deepClone);
    }

    if (typeof obj === 'object' && obj !== null) {
        return Object.fromEntries(
            Object.entries(obj)
                .map(([key, value]) => [key, deepClone(value)]),
        );
    }

    return obj;
}

export function pathBuilder(item) {
    if (item?.objectURL) {
        return URL.createObjectURL(item);
    }

    return item ? `http://localhost:3000${item}` : 'No icon';
}

/**
 * Преобразует объект с ключами в точечной нотации в вложенный объект.
 *
 * @param {Object} obj - Исходный объект, например:
 * {
 *   "name.uk": "dsaasd",
 *   "name.ru": "dsaasd",
 *   "code": "asdasd",
 *   "description": "adsadsads",
 *   "icon": ""
 * }
 *
 * @returns {Object} Преобразованный объект, например:
 * {
 *   name: { uk: "dsaasd", ru: "dsaasd" },
 *   code: "asdasd",
 *   description: "adsadsads",
 *   icon: ""
 * }
 */
export function convertDottedFieldKeysToNested(obj) {
    const result = {};
    Object.keys(obj).forEach(key => {
        if (key.includes('.')) {
            const parts = key.split('.');
            let current = result;
            parts.forEach((part, index) => {
                if (index < parts.length - 1) {
                    if (!current[part]) {
                        current[part] = {};
                    }
                    current = current[part];
                } else {
                    current[part] = obj[key];
                }
            });
        } else {
            result[key] = obj[key];
        }
    });
    return result;
}

export function deepSearchByCode(array, code, source = 'key') {
    for (const item of array) {
        if (item[source] === code) {
            return item;
        }

        if (Array.isArray(item.children) && item.children.length > 0) {
            const found = deepSearchByCode(item.children, code);
            if (found) return found;
        }
    }

    return null;
}

export function formatDate(isoString) {
    const date = new Date(isoString);
    return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function mapObject(obj) {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => {
            if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) {
                return [key, "---"];
            }

            // Преобразование строки с датой в форматированную дату
            if (typeof value === "string" && !isNaN(Date.parse(value))) {
                return [key, new Date(value).toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })];
            }

            return [key, value];
        })
    );
}

export function createQueryString(params) {
    const queryParams = [];

    // Проходим по объекту и добавляем каждый параметр в строку запроса
    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            // Если значение - это массив (например, для filters), соединяем значения через запятую
            queryParams.push(`${key}=${value.join(',')}`);
        } else if (value !== undefined && value !== null) {
            // Если значение не пустое, добавляем его в строку
            queryParams.push(`${key}=${encodeURIComponent(value)}`);
        }
    }

    // Собираем все параметры в одну строку
    return queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
}

function getQueryParams(queryString) {
    // Убираем символ "?" из начала строки, если он есть
    const query = queryString.startsWith('?') ? queryString.slice(1) : queryString;

    // Разбиваем строку на параметры по символу "&"
    const pairs = query.split('&');

    // Преобразуем массив пар в объект
    const params = pairs.reduce((acc, pair) => {
        const [key, value] = pair.split('=');
        if (key) {
            acc[key] = decodeURIComponent(value || '');
        }
        return acc;
    }, {});

    return params;
}

export function extractFields(items, nestedKey) {
    return items.map(item => {
        const mappedItem = mapObject(item);

        if (mappedItem[nestedKey] && typeof mappedItem[nestedKey] === "object") {
            const {[nestedKey]: nestedData, ...rest} = mappedItem;
            return {
                ...rest,
                ...mapObject(nestedData)
            };
        }

        return mappedItem;
    });
};



