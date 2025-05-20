import {computed} from "vue";

export const ordersRelatedTable = {
    relatedConfig: {
        paginator: true,
        rows: 10,
        skip: 0,
        lazy: false,
        rowsPerPageOptions: [10, 20, 30],
        tableStyle: "min-width: 50rem",
        class: "custom-table",
        columns: [
            {field: 'quantity', header: computed(() => t("table_header_quantity")), slotName: 'quantity'},
            {field: 'name', header: computed(() => t("table_header_name")), class: 'multiline-truncate'},
            {
                field: 'image',
                header: computed(() => t("table_header_image")),
                slotName: 'image',
                style: "width: 20%"
            },
            {field: "price", header: computed(() => t("table_header_price")),  slotName: "price", style: "width: 10%",},
            {field: 'description', header: computed(() => t("table_header_description")),  style: 'width: 30%', class: 'multiline-truncate'},
            {field: 'category', header: computed(() => t("table_header_category")), class: 'multiline-truncate'},
            {field: 'availability', header: computed(() => t("table_header_availability")), slotName: 'availability'},
            {
                field: 'actions',
                header: '',
                slotName: 'actions',
                style: 'width: 5%',
            },
        ],
    }
}