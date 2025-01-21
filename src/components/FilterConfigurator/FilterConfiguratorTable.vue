<template>
  <div>
    <h1>Three</h1>
    <TreeTable :value="nodes" @node-expand="onNodeExpand"  tableStyle="min-width: 50rem">
      <Column field="name" header="Name"  :expander="true" style="width: 34%"></Column>
      <Column field="size" header="Size" style="width: 33%"></Column>
      <Column
          header="Type (Custom)"
          style="width: 33%"
      >
        <template #body="{ node }">
          <div>
            <Button type="button" icon="pi pi-ellipsis-v" @click="(event) => toggle(event,node)" aria-haspopup="true" aria-controls="overlay_menu" />
          </div>
        </template>
      </Column>
    </TreeTable>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from 'vue';
import eventBus from "../../../eventBus.js";
import {deepSearchByCode} from "@/utils/index.js";

const onNodeExpand = (event) => {
  console.log("onNodeExpand", event)
}
// todo (name(uk,ru), code, icon, description)

const node = {
  children: [],
  code: "as",
  createdAt: "2025-01-19T13:56:07.303Z",
  name: {
    ru: "asdasd",
    uk: "asd"
  },
  parentId: null,
  updatedAt: "2025-01-19T13:56:07.303Z",
  __v: 0,
  _id: "678d047795e0b56fae151ea4"
};

const menu = ref();
const items = ref([
  {
    items: [
      {
        label: "Add",
        icon: "pi pi-refresh",
        command: () => handleOpenPopup(activeFilter.value, "add"),
      },
      {
        label: "Edit",
        icon: "pi pi-upload",
        command: () => handleOpenPopup(activeFilter.value, "edit"),
      },
    ],
  },
]);



const handleOpenPopup = (filter, eventType = "add") => {
  eventBus.emit("show-popup", {
    title: "Add Filter",
    parentFilter: filter,
    eventType,
    fields: [
      {
        code: "name.ua",
        component: "InputText",
        props: { type: "text", placeholder: "Name (UA)" },
        validators: [(value) => (value ? true : "Name (UA) is required")],
      },
      {
        code: "name.ru",
        component: "InputText",
        props: { type: "text", placeholder: "Name (RU)" },
        validators: [(value) => (value ? true : "Name (RU) is required")],
      },
      {
        code: "code",
        component: "InputText",
        props: { type: "text", placeholder: "Unique Code" },
        validators: [
          (value) => (value ? true : "Code is required"),
          (value) => /^[a-zA-Z]+$/.test(value) || "Code can only contain English letters",
        ],
      },
    ],
  });
};

const onAddFilter = (options) => {
  const { parent, newFilter } = options;
  const activeFilter = deepSearchByCode(nodes.value, parent.code);
  console.log("onAddFilter parent", parent)
  console.log("onAddFilter newFilter", newFilter)
  console.log("onAddFilter activeFilter", activeFilter)
};

onMounted(() => {
  eventBus.on("add-filter", onAddFilter);
});

onUnmounted(() => {
  eventBus.off("add-filter", onAddFilter);
});

const activeFilter = ref({});

const toggle = (event, node) => {
  console.log("toggle", node)
  activeFilter.value = node;
  menu.value.toggle(event);
};
//todo [children.length - 1] - итерация начинаеться с 0 елемента
// pathGenerator() `${key}-[children.length - 1]`
const nodes = ref([
  {
    key: '0',
    data: {
      code: 'root',
      name: 'Applications',
      size: '100kb',
      type: 'Folder'
    },
    children: [
      {
        key: '0-0',
        data: {
          name: 'Vue',
          size: '25kb',
          type: 'Folder'
        },
        children: [
          {
            key: '0-0-0',
            data: {
              name: 'package.json',
              size: '10kb',
              type: 'Text'
            }
          },
        ]
      },
    ]
  },
  {
    key: '1',
    data: {
      name: 'Cloud',
      size: '20kb',
      type: 'Folder'
    },
    children: [
      {
        key: '1-0',
        data: {
          name: 'backup-1.zip',
          size: '10kb',
          type: 'Zip'
        }
      },
      {
        key: '1-1',
        data: {
          name: 'backup-2.zip',
          size: '10kb',
          type: 'Zip'
        }
      }
    ]
  },
  {
    key: '2',
    data: {
      name: 'Desktop',
      size: '150kb',
      type: 'Folder'
    },
    children: [
      {
        key: '2-0',
        data: {
          name: 'note-meeting.txt',
          size: '50kb',
          type: 'Text'
        }
      },
      {
        key: '2-1',
        data: {
          name: 'note-todo.txt',
          size: '100kb',
          type: 'Text'
        }
      }
    ]
  },
  {
    key: '3',
    data: {
      name: 'Documents',
      size: '75kb',
      type: 'Folder'
    },
    children: [
      {
        key: '3-0',
        data: {
          name: 'Work',
          size: '55kb',
          type: 'Folder'
        },
        children: [
          {
            key: '3-0-0',
            data: {
              name: 'Expenses.doc',
              size: '30kb',
              type: 'Document'
            }
          },
          {
            key: '3-0-1',
            data: {
              name: 'Resume.doc',
              size: '25kb',
              type: 'Resume'
            }
          }
        ]
      },
      {
        key: '3-1',
        data: {
          name: 'Home',
          size: '20kb',
          type: 'Folder'
        },
        children: [
          {
            key: '3-1-0',
            data: {
              name: 'Invoices',
              size: '20kb',
              type: 'Text'
            }
          }
        ]
      }
    ]
  },
]);
</script>


<style scoped>

</style>
