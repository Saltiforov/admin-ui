<template>
  <div>
    <h1>Filters Page</h1>
    <AccordionWrapper :filters="filters"></AccordionWrapper>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getFiltersList } from "@/services/api/filters-service.api.js";

const filters = ref([
  {
    "name": {
      "ru": "asdasd",
      "uk": "asd"
    },
    "_id": "678d047795e0b56fae151ea4",
    "code": "as",
    "parentId": null,
    "children": [],
    "createdAt": "2025-01-19T13:56:07.303Z",
    "updatedAt": "2025-01-19T13:56:07.303Z",
    "__v": 0
  },
  {
    "name": {
      "ru": "asdasdasd",
      "uk": "asdakldjalksd"
    },
    "_id": "678d059995e0b56fae151ea9",
    "code": "sdadsasdasdasdasdsa",
    "parentId": null,
    "children": [
      {
        "name": {
          "ru": "child1",
          "uk": "child2"
        },
        "_id": "678d059995e0b56fae151ea9",
        "code": "child1",
        "parentId": null,
        "children": [
          {
            "name": {
              "ru": "sub-child",
              "uk": "sub-child2"
            },
            "_id": "678d059995e0b56fae151ea9",
            "code": "sub-child",
            "parentId": null,
            "children": [],
            "createdAt": "2025-01-19T14:00:57.293Z",
            "updatedAt": "2025-01-19T14:00:57.293Z",
            "__v": 0
          },
        ],
        "createdAt": "2025-01-19T14:00:57.293Z",
        "updatedAt": "2025-01-19T14:00:57.293Z",
        "__v": 0
      },
    ],
    "createdAt": "2025-01-19T14:00:57.293Z",
    "updatedAt": "2025-01-19T14:00:57.293Z",
    "__v": 0
  },
  {
    "name": {
      "ru": "asdasdasd",
      "uk": "asdakldjalksd"
    },
    "_id": "678d05a395e0b56fae151eab",
    "code": "asbnzxxcbznxcbjskdfsjkfhjskdfsdf",
    "parentId": null,
    "children": [],
    "createdAt": "2025-01-19T14:01:07.095Z",
    "updatedAt": "2025-01-19T14:01:07.095Z",
    "__v": 0
  },
  {
    "name": {
      "ru": "2",
      "uk": "1"
    },
    "_id": "678d05a895e0b56fae151ead",
    "code": "ierutoieurtioteuoiert",
    "parentId": null,
    "children": [],
    "createdAt": "2025-01-19T14:01:12.808Z",
    "updatedAt": "2025-01-19T14:01:12.808Z",
    "__v": 0
  }
])
const error = ref(null)
// example for using api routes
const fetchFiltersList = async () => {
  try {
    // const response = await getFiltersList();
    filters.value = response?.data || []; // Сохраняем данные из ответа
  } catch (err) {
    error.value = 'Ошибка загрузки пользователей';
  }
};

onMounted(() => {
  fetchFiltersList();
});
</script>