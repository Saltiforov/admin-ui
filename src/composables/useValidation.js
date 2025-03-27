import {reactive, toRefs, watch} from 'vue';

export function useValidation(fieldsConfig, formData) {
    const state = reactive({
        errors: {},
        isValid: true,
    });

    watch(formData, (newValue) => {
        console.log("useValidation", newValue);
    })

    const validateFields = () => {
        state.isValid = true;
        state.errors = {};

        Object.keys(fieldsConfig).forEach((key) => {


            const field = fieldsConfig[key];
            const fieldValue = formData[key];

            if (field.validators) {
                for (const validator of field.validators) {
                    const validationResult = validator(fieldValue);
                    console.log("validationResult", validationResult);
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
