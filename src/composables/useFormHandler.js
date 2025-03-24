import {ref} from "vue";
import {useValidation} from "@/composables/useValidation";

export function useFormHandler(getFields, getData) {
    const fieldsErrors = ref({});

    const handleSubmit = async (action) => {
        const {isValid, errors, validateFields} = useValidation(
            getFields(),
            getData()
        );

        validateFields();

        fieldsErrors.value = errors.value;

        if (!isValid.value) return;

        try {
            return await action(getData());
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {handleSubmit, fieldsErrors};
}
