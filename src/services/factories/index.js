import {productsFooterActions} from "@/services/factories/detailsPage/products/footer-actions-block.js";
import {productsFieldsBlock} from "@/services/factories/detailsPage/products/fields-block.js";
import {productsFilesBlock} from "@/services/factories/detailsPage/products/files-block.js";
import {productsDynamicAttrsBlock} from "@/services/factories/detailsPage/products/dynamic-attrs.js";
import {DETAILS_PAGES, PAGES, PAGES_TYPE} from "@/constants/pages.enum.js";
import {usersFieldsBlock} from "@/services/factories/detailsPage/users/fields-block.js";
import {usersFilesBlock} from "@/services/factories/detailsPage/users/files-block.js";
import {usersFooterActions} from "@/services/factories/detailsPage/users/footer-actions-block.js";
import UserDetailsWrapper from "@/components/DetailsPage/Wrappers/UserDetailsWrapper.vue";
import ProductDetailsWrapper from "@/components/DetailsPage/Wrappers/ProductDetailsWrapper.vue";

import {getProductById} from "@/services/api/product-service.api.js";
import OrderDetailsWrapper from "@/components/DetailsPage/Wrappers/OrderDetailsWrapper.vue";
import {ordersFieldsBlock} from "@/services/factories/detailsPage/orders/fields-block.js";
import {ordersFooterActions} from "@/services/factories/detailsPage/orders/footer-actions-block.js";
import {getOrderById} from "@/services/api/orders-service.api.js";
import {ordersRelatedTable} from "@/services/factories/detailsPage/orders/related-entities-table-block.js";
import {ordersPopups} from "@/services/factories/detailsPage/orders/popup-handler.js";
import {POPUP_TYPE} from "@/constants/popups.enum.js";
import {filtersPopups} from "@/services/factories/detailsPage/filters/popup-handler.js";
import AboutUsStaticInformation from "@/views/StaticInformation/AboutUsStaticInformation.vue";
import ShippingAndPayment from "@/views/StaticInformation/ShippingAndPayment.vue";
import {aboutUsFieldsBlock} from "@/services/factories/detailsPage/static-information/about-us/fields-block.js";
import {
    shippingAndPaymentFieldsBlock
} from "@/services/factories/detailsPage/static-information/shipping-and-payment/fields-block.js";
import {getStaticPageBySlug} from "@/services/api/static-information.js";
import {newArrivalsFieldsBlock} from "@/services/factories/detailsPage/static-information/new-arrivals/fields-block.js";
import NewArrivalsStatic from "@/views/StaticInformation/NewArrivalsStatic.vue";
import {
    deliveryAndPaymentFieldsBLock
} from "@/services/factories/detailsPage/static-information/delivery-and-payment-product/fields-block.js";
import DeliveryAndPaymentProduct from "@/views/StaticInformation/DeliveryAndPaymentProduct.vue";
import {
    aboutUsStaticInfoBlock
} from "@/services/factories/detailsPage/static-information/about-us/static-info-block.js";


const blocks = {
    [PAGES.PRODUCTS]: {
        [PAGES_TYPE.DETAILS_PAGE]: {
            blockList: {
                ...productsFieldsBlock,
                ...productsFilesBlock,
                ...productsDynamicAttrsBlock,
                ...productsFooterActions,
            },
            pageName: ProductDetailsWrapper,
            source: DETAILS_PAGES.PRODUCTS,
            fetchData: ({ id }) => getProductById(id),
        }
    },
    [PAGES.USERS]: {
        [PAGES_TYPE.DETAILS_PAGE]: {
            blockList: {
                ...usersFieldsBlock,
                ...usersFilesBlock,
                ...usersFooterActions,
            },
            source: DETAILS_PAGES.USERS,
            pageName: UserDetailsWrapper,
        }
    },
    [PAGES.ORDERS]: {
        [PAGES_TYPE.DETAILS_PAGE]: {
            blockList: {
                ...ordersFieldsBlock,
                ...ordersFooterActions,
                ...ordersRelatedTable,
            },
            source: DETAILS_PAGES.ORDERS,
            pageName: OrderDetailsWrapper,
            fetchData: ({ id }) => getOrderById(id),
        }
    },
    [PAGES.STATIC_INFO_SHIPPING]: {
        [PAGES_TYPE.DETAILS_PAGE]: {
            blockList: {
                ...shippingAndPaymentFieldsBlock,
            },
            source: DETAILS_PAGES.STATIC_INFO_SHIPPING,
            pageName: ShippingAndPayment,
            fetchData: ({ slug }) => getStaticPageBySlug(slug),
        }
    },
    [PAGES.STATIC_INFO_ABOUT_US]: {
        [PAGES_TYPE.DETAILS_PAGE]: {
            blockList: {
                ...aboutUsFieldsBlock,
                ...aboutUsStaticInfoBlock,
            },
            source: DETAILS_PAGES.STATIC_INFO_ABOUT_US,
            pageName: AboutUsStaticInformation,
            fetchData: ({ slug }) => getStaticPageBySlug(slug),
        }
    },
    [PAGES.STATIC_INFO_NEW_ARRIVALS]: {
        [PAGES_TYPE.DETAILS_PAGE]: {
            blockList: {
                ...newArrivalsFieldsBlock,
            },
            source: DETAILS_PAGES.STATIC_INFO_NEW_ARRIVALS,
            pageName: NewArrivalsStatic,
            fetchData: ({ slug }) => getStaticPageBySlug(slug),
        }
    },
    [PAGES.STATIC_INFO_DELIVERY_AND_PAYMENT_PRODUCT]: {
        [PAGES_TYPE.DETAILS_PAGE]: {
            blockList: {
                ...deliveryAndPaymentFieldsBLock,
            },
            source: DETAILS_PAGES.STATIC_INFO_DELIVERY_AND_PAYMENT_PRODUCT,
            pageName: DeliveryAndPaymentProduct,
            fetchData: ({ slug }) => getStaticPageBySlug(slug),
        }
    },
}

const popupHandlers = {
    [PAGES.ORDERS]: {
        [POPUP_TYPE.ORDERS_POPUPS]: {
                ...ordersPopups
        }
    },
    [PAGES.FILTERS]: {
        [POPUP_TYPE.FILTERS_POPUPS]: {
                ...filtersPopups
        }
    },
}

export function getPopupConfig(pageName, popupType) {
    return popupHandlers[pageName]?.[popupType] || null;
}

export function getPageConfig(pageName, pageType, options = {}) {
    return blocks[pageName][pageType];
}
