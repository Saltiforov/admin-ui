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

    return item ? `http://localhost:3000${item}`: 'No icon';
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

