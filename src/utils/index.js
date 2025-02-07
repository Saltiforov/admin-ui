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
    console.log('pathBuilder', item);
    if (item?.objectURL) {
        return URL.createObjectURL(item);
    }

    return item ? `http://localhost:3000${item}` : 'No icon';
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

