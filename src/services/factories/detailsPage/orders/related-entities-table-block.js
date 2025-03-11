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
            {field: 'quantity', header: 'Quantity', slotName: 'quantity'},
            {field: 'name', header: 'Name'},
            {
                field: 'image',
                header: 'Image',
                slotName: 'image',
            },
            {field: 'price', header: 'Price',},
            {field: 'description', header: 'Description',  style: 'width: 30%'},
            {field: 'category', header: 'Category'},
            {field: 'availability', header: 'Availability', slotName: 'availability'},
            {
                field: 'actions',
                header: '',
                slotName: 'actions',
                style: 'width: 5%',
            },
        ],
    }
}