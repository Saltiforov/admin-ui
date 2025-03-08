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
                validators: [
                    (value) => (value ? true : "Username is required"),
                ],
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
                }
            },
            {
                name: 'discount',
                code: 'discount',
                label: 'Discount',
                type: 'InputNumber',
                props: {
                    type: 'number',
                    placeholder: 'Enter discount',
                    required: true
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
                    required: true
                }
            },

            {
                name: 'orderStatus',
                code: 'orderStatus',
                label: 'Order Status',
                type: 'MultiSelect',
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
                type: 'MultiSelect',
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
                }
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
                }
            },
            {
                name: 'postalCode',
                code: 'postalCode',
                label: 'Postal Code',
                type: 'InputNumber',
                props: {
                    type: 'number',
                    placeholder: 'Enter postal code',
                    required: true
                }
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
                }
            },

        ],
        header: 'Fill order information:',
    }
}
