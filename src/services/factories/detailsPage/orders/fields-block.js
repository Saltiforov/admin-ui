export const ordersFieldsBlock = {
    fields: {
        items: [
            {
                name: 'userName',
                code: 'userName',
                label: 'User Name',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter user name',
                    required: true
                },
                // validators: [
                //     (value) => (value ? true : "Username is required"),
                // ],
            },
            {
                name: 'totalAmount',
                code: 'totalAmount',
                label: 'Total Amount',
                type: 'InputNumber',
                props: {
                    type: 'number',
                    placeholder: 'Enter total amount',
                    required: true
                },
                validators: [
                    (value) => (value !== null && value !== undefined ? true : "Total Amount is required"),
                ],
            },
            {
                name: 'discount',
                code: 'discount',
                label: 'Discount',
                type: 'InputNumber',
                props: {
                    type: 'number',
                    placeholder: 'Enter discount',
                    required: false
                }
            },
            {
                name: 'tax',
                code: 'tax',
                label: 'Tax',
                type: 'InputNumber',
                props: {
                    type: 'number',
                    placeholder: 'Enter tax',
                    required: false
                }
            },
            {
                name: 'orderStatus',
                code: 'orderStatus',
                label: 'Order Status',
                type: 'Select',
                props: {
                    options: [
                        {label: 'Pending', value: 'pending'},
                        {label: 'Confirmed', value: 'confirmed'},
                        {label: 'Shipped', value: 'shipped'},
                        {label: 'Delivered', value: 'delivered'},
                        {label: 'Cancelled', value: 'cancelled'},
                    ],
                    optionLabel: 'label',
                    placeholder: 'Select order status',
                    class: 'w-full md:w-56',
                    required: false
                }
            },
            {
                name: 'paymentMethod',
                code: 'paymentMethod',
                label: 'Payment Method',
                type: 'Select',
                props: {
                    options: [
                        {label: 'Card', value: 'card'},
                        {label: 'Cash', value: 'cash'},
                    ],
                    optionLabel: 'label',
                    placeholder: 'Select payment method',
                    class: 'w-full md:w-56',
                    required: false
                }
            },
            {
                name: 'street',
                code: 'street',
                label: 'Street',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter street',
                    required: true
                },
                validators: [
                    (value) => (value ? true : "Street is required"),
                ],
            },
            {
                name: 'city',
                code: 'city',
                label: 'City',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter city',
                    required: true
                },
                validators: [
                    (value) => (value ? true : "City is required"),
                ],
            },
            {
                name: 'postalCode',
                code: 'postalCode',
                label: 'Postal Code',
                type: 'InputNumber',
                props: {
                    type: 'number',
                    placeholder: 'Enter postal code',
                    required: true,
                    useGrouping: false,
                },
                validators: [
                    (value) => (value ? true : "Postal Code is required"),
                ],
            },
            {
                name: 'country',
                code: 'country',
                label: 'Country',
                type: 'InputText',
                props: {
                    type: 'text',
                    placeholder: 'Enter country',
                    required: true
                },
                validators: [
                    (value) => (value ? true : "Country is required"),
                ],
            },
        ],
        header: 'Fill order information:',
    }
};
