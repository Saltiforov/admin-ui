import {computed, ref} from 'vue';
import {defineStore} from "pinia";

export const useRolesStore = defineStore('rolesStore', () => {
    const roles = ref([
        {
            role_name: "Admin",
            code: "ADMIN",
            filtersView: true,
            permissions: {
                filters: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
                products: {
                    view: true,
                    create: false,
                    edit: true,
                    delete: false,
                },
                users: {
                    view: true,
                    create: false,
                    edit: false,
                    delete: false,
                },
                orders: {
                    view: false,
                    create: true,
                    edit: true,
                    delete: true,
                },
            }
        },
        {
            role_name: "Developer",
            code: "DEVELOPER",
            filtersView: true,
            permissions: {
                filters: {
                    view: false,
                    create: true,
                    edit: true,
                    delete: true,
                },
                products: {
                    view: true,
                    create: false,
                    edit: true,
                    delete: false,
                },
                users: {
                    view: false,
                    create: false,
                    edit: false,
                    delete: false,
                },
                orders: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
            }
        },
    ]);

    function addNewRole(role) {
        roles.value.push(role);
    }

    const getAllRoles = computed(() => roles.value);


    return {roles, addNewRole, getAllRoles};
});
