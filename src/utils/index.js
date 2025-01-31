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

    return item ? `http://localhost:3000${item}`: 'No icon';
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

