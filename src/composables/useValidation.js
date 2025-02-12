import { reactive, toRefs } from 'vue';

export function useValidation(fieldsConfig, formData) {
    const state = reactive({
        errors: {},
        isValid: true,
    });

    const validateFields = () => {
        state.isValid = true;
        state.errors = {};

        Object.keys(fieldsConfig).forEach((key) => {
            const field = fieldsConfig[key];
            const fieldValue = formData[key];

            if (field.validators) {
                for (const validator of field.validators) {
                    const validationResult = validator(fieldValue);
                    if (validationResult !== true) {
                        state.errors[key] = validationResult;
                        state.isValid = false;
                        break;
                    }
                }
            }
        });
    };

    return {
        ...toRefs(state),
        validateFields,
    };
}
