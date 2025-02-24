import { useRoute, useRouter } from "vue-router";

export function useQueryUpdater() {
    const route = useRoute();
    const router = useRouter();

    const updateQuery = (newParams) => {
        // Объединяем старые query с новыми
        const updatedQuery = { ...route.query, ...newParams };

        // Убираем пустые, null и undefined значения
        const cleanedQuery = Object.fromEntries(
            Object.entries(updatedQuery).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
        );

        router.push({ path: route.path, query: cleanedQuery });
    };

    return { updateQuery };
}
