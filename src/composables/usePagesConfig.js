import { ref, computed } from 'vue';
import { getPageConfig } from "@/services/factories/index.js";
import { PAGES_TYPE } from "@/constants/pages.enum.js";

export function usePagesConfig(pageType, options = {}, isDataRequired) {
    // ✅ Проверяем наличие либо id, либо slug
    const needToLoadData = computed(() => Boolean(options?.id || options?.slug));

    const data = ref({});
    const loading = ref(needToLoadData.value);

    const config = getPageConfig(pageType, PAGES_TYPE.DETAILS_PAGE);

    async function useFetch() {
        const pagesFetchLoop = {};

        Object.keys(config).forEach((key) => {
            if (key === 'fetchData') {
                pagesFetchLoop[config.source] = config.fetchData;
            }
        });

        if (Object.keys(pagesFetchLoop).length) {
            const fetchEntries = Object.entries(pagesFetchLoop);

            const promises = fetchEntries.map(([key, fetchDataFn]) =>
                fetchDataFn(options)
                    .then(result => ({ key, result }))
                    .catch(error => ({ key, error }))
            );

            const results = await Promise.allSettled(promises);

            results.forEach(r => {
                if (r.status === "fulfilled" && r.value) {
                    data.value[r.value.key] = r.value.result;
                } else if (r.status === "rejected" && r.reason) {
                    console.error(`Error fetching data for key ${r.reason.key}:`, r.reason.error);
                    data.value[r.reason.key] = null;
                }
            });
        }

        stopLoading();
    }

    const startLoading = () => {
        loading.value = true;
    };

    const stopLoading = () => {
        loading.value = false;
    };

    // 🧠 Стартуем загрузку только при наличии id или slug
    if (needToLoadData.value) {
        useFetch().catch(console.error);
    }

    return {
        data,
        blockList: computed(() => config?.blockList || {}),
        pageName: computed(() => config?.pageName || ''),
        isLoading: computed(() => loading.value),
        stopLoading,
        startLoading,
        useFetch,
    };
}
