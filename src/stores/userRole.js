import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('userRole', () => {
    const userRole = ref(null); // Хранит роль пользователя

    // Устанавливаем роль
    function setUserRole(role) {
        userRole.value = role;
    }

    // Проверяем, является ли пользователь админом
    const isAdmin = computed(() => userRole.value === 'Admin');

    // Проверяем, есть ли у пользователя доступ к управлению
    const canManage = computed(() => ['Admin', 'Moderator', 'Manager'].includes(userRole.value));

    return { userRole, setUserRole, isAdmin, canManage };
});
