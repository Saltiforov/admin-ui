import { useRoute, useRouter } from "vue-router";

export function useQueryUpdater() {
    const route = useRoute();
    const router = useRouter();

    const updateQuery = (newParams) => {
        const updatedQuery = { ...route.query, ...newParams };

        const serializedQuery = Object.fromEntries(
            Object.entries(updatedQuery).map(([key, value]) => {
                if (Array.isArray(value)) {
                    return [key, value.join(',')];
                }
                return [key, value];
            })
        );

        const cleanedQuery = Object.fromEntries(
            Object.entries(serializedQuery).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
        );

        router.push({ path: route.path, query: cleanedQuery });
    };

    return { updateQuery };
}
