import {computed, ref} from "vue";

export const dataProductsTableConfig = ref({
    paginator: true,
    lazy: true,
    rowsPerPageOptions: [10, 20, 30],
    tableStyle: "min-width: 50rem",
    class: "custom-table",
    size: 'null',
    columns: [
        {field: "name", header: computed(() => t("table_header_name")), style: "width: 10%", class: "multiline-truncate", slotName: "name",},
        {
            field: "image",
            header: computed(() => t("table_header_image")),
            slotName: "image",
            style: "width: 10%",
        },
        {field: "price", header: computed(() => t("table_header_price")),  slotName: "price", style: "width: 10%",},
        { field: "description", header: computed(() => t("table_header_description")), class: "multiline-truncate" },
        { field: "slug", header: computed(() => t("table_header_slug")), class: "multiline-truncate" },
        { field: "reviews", header: computed(() => t("table_header_reviews")), class: "multiline-truncate", slotName: "reviews", },
        {
            field: "actions",
            header: computed(() => ""),
            slotName: "actions",
            style: "width: 10%",
        },
    ],
})