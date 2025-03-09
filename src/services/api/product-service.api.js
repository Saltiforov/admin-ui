import app from '@/main'

const router = {
    products: '/api/products',
}

export async function getProductsList(query = {}) {
    try {
        const api = app.config.globalProperties.$api;

        const url =  query.length ? `${router.products}${query}` : router.products;

        const response = await api.get(url);

        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        console.error('Error in getFiltersList:', error);
        throw error;
    }
}

export async function getProductById(productId) {
    try {
        const api = app.config.globalProperties.$api;

        const response = await api.get(`${router.products}/${productId}`);

        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        console.error('Error in getFiltersList:', error);
        throw error;
    }
}

export async function uploadProductImages(productId, images, headers) {
    try {
        const api = app.config.globalProperties.$api;

        return await api.post(`${router.products}/${productId}/images`, images, headers);
    } catch (error) {
        console.error('Error in getFiltersList:', error);
        throw error;
    }
}

export async function updateProductById(productId, updatedProduct) {
    try {
        const api = app.config.globalProperties.$api;

        return await api.put(`${router.products}/${productId}`, updatedProduct);
        //
        // if (response.status === 200) {
        //     return response.data;
        // }

    } catch (error) {
        console.error('Error in getFiltersList:', error);
        throw error;
    }
}



export async function deleteProductById(productId) {
    const api = app.config.globalProperties.$api;

    try {
        const response = await api.delete(`${router.products}/${productId}`);
        if (response.status === 200) {
            return response.data;
        }
    } catch (error) {
        console.error('Error in deleteProductById:', error);
    }
}

export async function createProduct(product) {
    const api = app.config.globalProperties.$api;

    try {

        const response = await api.post(`${router.products}`, product);

        return response;

    } catch (error) {
        console.error('Error in createProduct:', error);
        throw error;
    }
}
