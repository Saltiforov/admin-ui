import {computed} from "vue";

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

            // Проверяем, является ли значение строкой и корректной датой
            if (typeof value === "string") {
                const date = new Date(value);
                if (!isNaN(date.getTime()) && value.includes("-")) {
                    return [key, date.toLocaleDateString("ru-RU", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric"
                    })];
                }
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

export function extractFields(items, nestedKey) {
    return items.map(item => {
        const mappedItem = mapObject(item);
        console.log("mappedItem", mappedItem)

        if (mappedItem[nestedKey] && typeof mappedItem[nestedKey] === "object") {
            const {[nestedKey]: nestedData, ...rest} = mappedItem;
            return {
                ...rest,
                ...mapObject(nestedData)
            };
        }

        console.log("mappedItem", mappedItem)
        return mappedItem;
    });
};

export function validateFormFields(fields, formValues) {
    let isValid = true;
    const errors = {};

    fields.forEach((field) => {
        errors[field.code] = null;

        if (field.validators) {
            for (const validator of field.validators) {
                const validationResult = validator(formValues[field.code]);
                if (validationResult !== true) {
                    errors[field.code] = validationResult;
                    isValid = false;
                    break;
                }
            }
        }
    });

    return {isValid, errors};
}

export function mappedFieldsForValidation(fields) {
    return fields.reduce((acc, field) => {
        acc[field.code] = field;
        return acc;
    }, {});
}

export async function handleRequest(validFunc, isValid, action, data, onSuccess) {
    validFunc();

    if (!isValid.value) return;

    props.startLoading();

    try {
        const response = await action(data);
        if (response?.status === 200 && onSuccess) {
            onSuccess(response);
        }
    } finally {
        setTimeout(() => {
            props.stopLoading();
        }, 1000);
    }
}


// export function fullImageUrls(imagesRef) {
//     return imagesRef.map((url) =>
//         /^https?:\/\//.test(url) ? url : "http://localhost:3000" + url
//     )
// }


export function fullImageUrls(imagesRef, size = 'thumb') {
    return imagesRef.map(image => {
        const url = image.variants?.[size];

        if (!url) return null

        return /^https?:\/\//.test(url) ? url : "http://localhost:3000" + url;
    }).filter(Boolean);
}

export function capitalizeFirstLetter(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncateToDecimal(value, decimals) {
    const factor = Math.pow(10, decimals);
    return Math.floor(value * factor) / factor;
}

export const generatePageData = (slug, isAccordionFields, pageTitle, blockSections) => {
    if (isAccordionFields) {
        return {
            slug,
            title: pageTitle,
            accordion: true,
            content: blockSections.map(section => ({
                title: section.title,
                blocks: section.blocks.map(block => ({
                    title: block.blockTitle,
                    content: block.blockContent,
                })),
            })),
        };
    } else {
        return {
            slug,
            title: pageTitle,
            accordion: false,
            content: blockSections.flatMap(section =>
                section.blocks.map(block => ({
                    title: block.blockTitle || null,
                    content: block.blockContent,
                }))
            ),
        };
    }
};

