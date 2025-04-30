import AsyncMultiSelect from "@/components/UI/AsyncMultiSelect.vue";
import {computed} from "vue";

export const ordersPopups = {
    relatedEntitiesTablePopup: {
        fields: [
            {
                code: "products",
                component: AsyncMultiSelect,
                props: {
                    selectId: 'relatedEntitiesSelect',
                    filter: true,
                    filterPlaceholder: "Search...",
                    maxSelectedLabels: 1,
                    placeholder: computed(() => t("related_multiselect_placeholder")),
                    optionLabel: "name",
                    storeId: 'relatedEntitiesSelect',
                    itemsPerPage: 10,
                    skip: 0,
                    display: "chip",
                    restOptionsUrl: 'api/admin/products',
                    loading: false,
                    selectClass: "w-full",
                    style: "margin-bottom: 15px",
                },
            },
        ]
    }
}