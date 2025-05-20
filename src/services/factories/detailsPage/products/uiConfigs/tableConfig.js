import {computed, ref} from "vue";

export const dataProductsTableConfig = ref({
    paginator: true,
    lazy: true,
    rowsPerPageOptions: [10, 20, 30],
    tableStyle: "min-width: 50rem",
    class: "custom-table",
    size: 'null',
    columns: [
        {field: "name", header: computed(() => t("table_header_name")), class: "multiline-truncate"},
        {
            field: "image",
            header: computed(() => t("table_header_image")),
            slotName: "image",
            style: "width: 15%",
        },
        {field: "price", header: computed(() => t("table_header_price")),  slotName: "price", style: "width: 10%",},
        {field: "description", header: computed(() => t("table_header_description")), class: "multiline-truncate"},
        {field: "category", header: computed(() => t("table_header_category"))},
        {field: "availability", header: computed(() => t("table_header_availability")), slotName: "availability"},
        {
            field: "actions",
            header: computed(() => ""), // Пустой заголовок, но оставлен computed для единообразия
            slotName: "actions",
            style: "width: 10%",
        },
    ],
})