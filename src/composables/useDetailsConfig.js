import {ref, computed, onMounted} from 'vue';
import {getProductById} from '@/services/api/product-service.api.js';

export function useDetailsConfig(pageType, id) {
    const data = ref(null);

    // Храним конфиги для разных страниц
    const configs = {
        products: {
            fields: [
                {
                    name: 'name',
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
                    name: 'discount',
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
                    label: 'Category',
                    type: 'InputText',
                    props: {
                        type: 'text',
                        class: 'product-input',
                        placeholder: 'Enter category',
                        required: true
                    }
                },
                {
                    name: 'tags',
                    label: 'Tags',
                    type: 'Select',
                    props: {
                        options: [
                            { label: 'Gaming', value: 'gaming' },
                            { label: 'Mouse', value: 'mouse' },
                            { label: 'Wireless', value: 'wireless' },
                            { label: 'RGB', value: 'RGB' }
                        ],
                        optionLabel: 'label',
                        placeholder: 'Select tags',
                        class: 'w-full product-input md:w-56',
                        required: false
                    }
                },
                {
                    name: 'availability',
                    label: 'Availability',
                    type: 'Checkbox',
                    props: {
                        binary: true,
                        placeholder: 'Is the product available?',
                        required: false
                    }
                },
                {
                    name: 'deliveryOptions',
                    label: 'Delivery Options',
                    type: 'Select',
                    props: {
                        options: [
                            { label: 'Standard Shipping', value: 'Standard Shipping' },
                            { label: 'Express Delivery', value: 'Express Delivery' }
                        ],
                        optionLabel: 'label',
                        placeholder: 'Select delivery options',
                        class: 'w-full product-input md:w-56',
                        required: false
                    }
                },
                {
                    name: 'rating',
                    label: 'Rating',
                    type: 'Rating',
                    props: {
                        stars: 5,
                        cancel: false,
                        placeholder: 'Select rating',
                        required: false
                    }
                },
                {
                    name: 'reviewCount',
                    label: 'Review Count',
                    type: 'InputNumber',
                    props: {
                        min: 0,
                        placeholder: 'Enter review count',
                        required: false
                    }
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'TextArea',
                    props: {
                        rows: 8,
                        cols: 40,
                        class: 'product-textarea',
                        placeholder: 'Enter product description',
                        required: false
                    }
                },
            ],
            fetchData: async () => await getProductById(id),
        },
    };

    // Загружаем данные при монтировании
    onMounted(async () => {
        if (configs[pageType]?.fetchData) {
            data.value = await configs[pageType].fetchData();
        }
    });

    return {
        data,
        config: computed(() => configs[pageType] || {}),
    };
}
