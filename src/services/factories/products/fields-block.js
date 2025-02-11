export const productsFieldsBlock = {
    fields: {
        items: [
            {
                name: 'name',
                code: 'name',
                label: 'Product Name',
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    placeholder: 'Enter product name',
                    required: true
                }
            },
            {
                name: 'price',
                code: 'price',
                label: 'Product Price',
                type: 'InputNumber',
                props: {
                    inputId: 'currency-us',
                    mode: 'currency',
                    currency: 'USD',
                    locale: 'en-US',
                    fluid: true,
                    placeholder: 'Enter price',
                    required: true
                }
            },
            {
                name: 'filters',
                code: 'filters',
                label: 'Related Filters',
                type: 'AsyncTreeSelect',
                disablePropsBinding: true,
                props: {
                    restOptionsUrl: 'api/filters',
                    placeholder: 'Select tags',
                    selectionMode: 'multiple',
                    class: 'w-full product-input md:w-56',
                    required: false,
                    showClear: true,
                    fullWidth: true,
                }
            },
            {
                name: 'discount',
                code: 'discount',
                label: 'Discount (%)',
                type: 'InputNumber',
                props: {
                    inputId: 'discount',
                    suffix: '%',
                    min: 0,
                    max: 100,
                    placeholder: 'Enter discount',
                    required: false
                }
            },
            {
                name: 'category',
                code: 'category',
                label: 'Category',
                type: 'InputText',
                props: {
                    type: 'text',
                    class: 'product-input',
                    placeholder: 'Enter category',
                    required: true
                }
            },
        ],
        header: 'Fill product information:',
    }
}
