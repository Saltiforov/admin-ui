export default function createDebouncedService() {
    let debounceTimeout;

    const debounceService = (fn, delay = 500) => {
        clearTimeout(debounceTimeout);

        debounceTimeout = setTimeout(() => {
            fn();
        }, delay);
    };

    return { debounceService };
}
