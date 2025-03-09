export const usersFilesBlock = {
    files: {
        uploadUrl: `${import.meta.env.VITE_BASIC_API_URL}/api/upload`,
        fieldName: 'file',
        multiple: true,
        auto: false,
        maxFileSize: 10000000,
        customUpload: false,
        accordion: true,
        header: 'Upload Image:',
        uploadMethod: () => {},
    }
}
