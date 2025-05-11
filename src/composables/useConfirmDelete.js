import {useToast} from "primevue/usetoast";
import {useConfirm} from "primevue/useconfirm";


export const useConfirmDelete = (options) => {
    const toast = useToast();
    const confirm = useConfirm();
    const {
        confirmMessage,
        confirmHeader,
        rejectLabel,
        acceptLabel,
        acceptAction,
        acceptToastSummary,
        acceptToastDetail,
        rejectToastSummary,
        rejectToastDetail,
        data
    } = options


    const confirmDelete = () => {
        confirm.require({
            message: confirmMessage,
            header:  confirmHeader,
            icon: 'pi pi-info-circle',
            rejectProps: {
                label: rejectLabel,
                severity: 'secondary',
                outlined: true,
            },
            acceptProps: {
                label: acceptLabel,
                severity: 'danger',
            },
            accept: () => {
                acceptAction(data._id)
                toast.add({
                    severity: 'info',
                    summary: acceptToastSummary,
                    detail: acceptToastDetail,
                    life: 3000
                });
            },
            reject: () => {
                toast.add({
                    severity: 'error',
                    summary: rejectToastSummary,
                    detail: rejectToastDetail,
                    life: 3000
                });
            },
        });

    }

    return {confirmDelete}

};