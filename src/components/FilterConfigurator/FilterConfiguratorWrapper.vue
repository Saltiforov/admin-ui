<template>
  <div class="additional__actions"></div>
  <FilterConfiguratorTable @filters-updated="emit('filters-updated')" :filters="filters"></FilterConfiguratorTable>
  <div class="footer__blocks"></div>
</template>

<script setup>

defineProps({
  filters: {
    type: Array,
    required: true,
  }
})
const emit = defineEmits(['filters-updated'])

const filtersNodes = [
  {
    children: [
      {
        children: [],
        code: "b1",
        createdAt: "2025-01-20T12:30:10.987Z",
        name: { ru: "дочерний 1", uk: "дочірній 1" },
        parentId: "678d047795e0b56fae151ea5",
        updatedAt: "2025-01-20T12:30:10.987Z",
        __v: 0,
        _id: "678d047795e0b56fae151ea9"
      }
    ],
    code: "bs",
    createdAt: "2025-01-20T10:15:30.123Z",
    name: { ru: "пример 1", uk: "приклад 1" },
    parentId: null,
    updatedAt: "2025-01-20T10:15:30.123Z",
    __v: 0,
    _id: "678d047795e0b56fae151ea5"
  },
  {
    children: [
      {
        children: [],
        code: "c1",
        createdAt: "2025-01-18T10:12:20.654Z",
        name: { ru: "дочерний 2", uk: "дочірній 2" },
        parentId: "678d047795e0b56fae151ea6",
        updatedAt: "2025-01-18T10:12:20.654Z",
        __v: 0,
        _id: "678d047795e0b56fae151eaa"
      },
      {
        children: [],
        code: "c2",
        createdAt: "2025-01-18T12:45:55.321Z",
        name: { ru: "дочерний 3", uk: "дочірній 3" },
        parentId: "678d047795e0b56fae151ea6",
        updatedAt: "2025-01-18T12:45:55.321Z",
        __v: 0,
        _id: "678d047795e0b56fae151eab"
      }
    ],
    code: "cs",
    createdAt: "2025-01-18T08:45:15.567Z",
    name: { ru: "пример 2", uk: "приклад 2" },
    parentId: "678d047795e0b56fae151ea5",
    updatedAt: "2025-01-18T08:45:15.567Z",
    __v: 0,
    _id: "678d047795e0b56fae151ea6"
  },
  {
    children: [],
    code: "ds",
    createdAt: "2025-01-21T14:22:05.890Z",
    name: { ru: "пример 3", uk: "приклад 3" },
    parentId: "678d047795e0b56fae151ea6",
    updatedAt: "2025-01-21T14:22:05.890Z",
    __v: 0,
    _id: "678d047795e0b56fae151ea7"
  },
  {
    children: [
      {
        children: [],
        code: "e1",
        createdAt: "2025-01-22T11:10:30.876Z",
        name: { ru: "дочерний 4", uk: "дочірній 4" },
        parentId: "678d047795e0b56fae151ea8",
        updatedAt: "2025-01-22T11:10:30.876Z",
        __v: 0,
        _id: "678d047795e0b56fae151eac"
      }
    ],
    code: "es",
    createdAt: "2025-01-22T09:30:45.234Z",
    name: { ru: "пример 4", uk: "приклад 4" },
    parentId: null,
    updatedAt: "2025-01-22T09:30:45.234Z",
    __v: 0,
    _id: "678d047795e0b56fae151ea8"
  }
];


</script>

<style scoped>

</style>
