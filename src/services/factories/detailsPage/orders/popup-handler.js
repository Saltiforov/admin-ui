import AsyncMultiSelect from "@/components/UI/AsyncMultiSelect.vue";

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
                    maxSelectedLabels: 5,
                    placeholder: "Select a value",
                    optionLabel: "name",
                    storeId: 'relatedEntitiesSelect',
                    itemsPerPage: 10,
                    skip: 0,
                    display: "chip",
                    restOptionsUrl: 'api/products',
                    loading: false,
                    selectClass: "w-full",
                    style: "margin-bottom: 15px",
                },
                validators: [(value) => (value ? true : "Products is required")],
            },
        ]
    }
}