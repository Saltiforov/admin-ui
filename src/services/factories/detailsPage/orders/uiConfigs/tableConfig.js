import {computed, ref} from "vue";

export const dataOrderTableConfig = ref({
    paginator: true,
    lazy: true,
    rows: 10,
    skip: 0,
    scrollable: true,
    rowsPerPageOptions: [10, 20, 30, 50],
    tableStyle: 'max-width: 100%; overflow-x: auto; border-radius: 20px',
    class: "custom-table",
    size: 'null',
    columns: [
        {field: 'orderNumber', header: computed(() => t('table_header_order_number')),},
        {field: 'orderStatus', header: computed(() => t('table_header_order_status')),slotName: 'status',},
        {field: 'country', header: computed(() => t('table_header_country')), class: 'multiline-truncate'},
        {field: 'city', header: computed(() => t('table_header_city')), class: 'multiline-truncate'},
        {field: 'street', header: computed(() => t('table_header_street')), class: 'multiline-truncate'},
        {field: 'postalCode', header: computed(() => t('table_header_postal_code')), class: 'multiline-truncate'},
        {field: 'discount', header: computed(() => t('table_header_discount')),},
        {field: 'createdAt', header: computed(() => t('table_header_created_at')),},
        {field: 'updatedAt', header: computed(() => t('table_header_updated_at')),},
        {
            field: 'actions',
            header: '',
            slotName: 'actions',
            style: 'width: 5%',
        },
    ]
});