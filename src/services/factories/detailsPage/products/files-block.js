import { uploadProductImages } from '@/services/api/product-service.api';
import {computed} from "vue";

export const productsFilesBlock = {
    files: {
        uploadUrl: `${import.meta.env.VITE_BASIC_API_URL}/api/upload`,
        fieldName: 'file',
        multiple: true,
        auto: false,
        maxFileSize: 10000000,
        customUpload: false,
        accordion: true,
        header: computed(() => t("label_upload_image")),
        uploadMethod: uploadProductImages,
    }
}
