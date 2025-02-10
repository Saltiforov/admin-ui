import {productsFooterActions} from "@/services/factories/products/footer-actions-block.js";
import {productsFieldsBlock} from "@/services/factories/products/fields-block.js";
import {productsFilesBlock} from "@/services/factories/products/files-block.js";
import {productsDynamicAttrsBlock} from "@/services/factories/products/dynamic-attrs.js";
import {DETAILS_PAGES, PAGES, PAGES_TYPE} from "@/constants/pages.enum.js";
import {usersFieldsBlock} from "@/services/factories/users/fields-block.js";
import {usersFilesBlock} from "@/services/factories/users/files-block.js";
import {usersFooterActions} from "@/services/factories/users/footer-actions-block.js";
import UserDetailsWrapper from "@/components/DetailsPage/Wrappers/UserDetailsWrapper.vue";
import ProductDetailsWrapper from "@/components/DetailsPage/Wrappers/ProductDetailsWrapper.vue";

import {getProductById} from "@/services/api/product-service.api.js";

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
    }
}

export function getPageConfig(pageName, pageType, options = {}) {
    return blocks[pageName][pageType];
}
