import {ref, computed, onMounted} from 'vue';
import {getProductById} from '@/services/api/product-service.api.js';
import ProductDetailsWrapper from "@/components/DetailsPage/Wrappers/ProductDetailsWrapper.vue";

export function useDetailsConfig(pageType, id) {
    const data = ref(null);
    const loading = ref(true); // Изначально true
    // todo add prepare fun for parsing details config from server data
    // Храним конфиги для разных страниц
    const configs = {
        products: {
            blockList: {
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
                        {
                            name: 'tags',
                            code: 'tags',
                            label: 'Tags',
                            type: 'MultiSelect',
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
                            code: 'availability',
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
                            code: 'deliveryOptions',
                            label: 'Delivery Options',
                            type: 'MultiSelect',
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
                            code: 'rating',
                            label: 'Rating',
                            type: 'Rating',
                            onlyEditMode: true,
                            props: {
                                stars: 5,
                                cancel: false,
                                placeholder: 'Select rating',
                                required: false
                            },

                        },
                        {
                            name: 'reviewCount',
                            code: 'reviewCount',
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
                            code: 'description',
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
                    header: 'Fill product information:',
                },
                files: {
                    uploadUrl: `${import.meta.env.VITE_BASIC_API_URL}/api/upload`,
                    fieldName: 'file',
                    multiple: true,
                    auto: false,
                    maxFileSize: 1000000,
                    customUpload: false,
                    accordion: true,
                    header: 'Upload Image:',
                },
                dynamicAttrs: {
                    relationCode: 'attributes',
                    initialPairs: [
                        { key: '', value: '' },
                        { key: '', value: '' },
                        { key: '', value: '' },
                        { key: '', value: '' }
                    ],
                    placeholders: {
                        key: 'Key',
                        value: 'Value'
                    },
                    buttonLabel: '+',
                    header: 'Specification:',
                    accordion: true,
                },
                footerActions: {
                    create: [{ label: 'Create new product', type: 'create',actionEventName: 'create'}],
                    edit: [
                        { label: 'Cancel', type: 'cancel', actionEventName: 'cancel' },
                        { label: 'Save', type: 'save', actionEventName: 'submit' }
                    ]
                }
            },
            pageName: ProductDetailsWrapper,
            fetchData: async () => await getProductById(id),
        },
    };

   async function useFetch() {
       if (configs[pageType]?.fetchData && id) {
           // todo delete after testing
           // setTimeout(async () => {
           data.value = await configs[pageType].fetchData();
           loading.value = false;
           // }, 5000)
       } else {
           loading.value = false;
       }
    }

    useFetch().catch(console.error);



    return {
        data,
        config: computed(() => configs[pageType]?.blockList || {}),
        pageName: computed(() => configs[pageType]?.pageName || ''),
        isLoading: computed(() => loading.value)
    };
}
