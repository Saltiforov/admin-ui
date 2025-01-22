<template>
  <div>
    <h1>Three</h1>
    <Button label="Add" icon="pi pi-check" @click="addNewFilter" />
    <TreeTable :value="nodes" @node-expand="onNodeExpand" >
      <Column header="Name" :expander="true" style="width: 34%">
        <template #body="{ node }">
          <div>{{  node.data.name['uk']  }}</div> / <div>{{ node.data.name['ru'] }}</div> <!-- Здесь вы можете кастомизировать отображение значения из поля "name" -->
        </template>
      </Column>
      <Column field="code" header="Code" style="width: 33%"></Column>
      <Column field="icon" header="Icon" style="width: 33%"></Column>
      <Column field="description" header="Description" style="width: 33%"></Column>
      <Column
          header="Type (Custom)"
          style="width: 33%"
      >
        <template #body="{ node }">
          <div>
            <Button type="button" icon="pi pi-ellipsis-v" @click="(event) => toggle(event,node)" aria-haspopup="true"
                    aria-controls="overlay_menu"/>
          </div>
        </template>
      </Column>
    </TreeTable>
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"/>
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
        props: {type: "text", placeholder: "Name (UA)"},
        validators: [(value) => (value ? true : "Name (UA) is required")],
      },
      {
        code: "name.ru",
        component: "InputText",
        props: {type: "text", placeholder: "Name (RU)"},
        validators: [(value) => (value ? true : "Name (RU) is required")],
      },
      {
        code: "code",
        component: "InputText",
        props: {type: "text", placeholder: "Unique Code"},
        validators: [
          (value) => (value ? true : "Code is required"),
          (value) => /^[a-zA-Z]+$/.test(value) || "Code can only contain English letters",
        ],
      },
    ],
  });
};

// const pathGenerator = (parent) => `${parent.key}-${parent.children.length - 1}`
const pathGenerator = (parent) => {
  const children = parent.children || [];

  if (children.length === 0) {
    const newIndex = 0;
    return `${parent.key}-${newIndex}`;
  }

  const lastChild = children[children.length - 1];

  const lastKeyParts = lastChild.key.split('-');
  const lastIndex = parseInt(lastKeyParts.pop(), 10);

  return `${parent.key}-${lastIndex + 1}`;
};

const addNewFilter = () => {
  console.log("addNewFilter")
  eventBus.emit('show-popup', {
    title: "Add new Filter",
    eventType: "addNewNode",
    fields: [
      {
        code: "name.ua",
        component: "InputText",
        props: {type: "text", placeholder: "Name (UA)"},
        validators: [(value) => (value ? true : "Name (UA) is required")],
      },
      {
        code: "name.ru",
        component: "InputText",
        props: {type: "text", placeholder: "Name (RU)"},
        validators: [(value) => (value ? true : "Name (RU) is required")],
      },
      {
        code: "code",
        component: "InputText",
        props: {type: "text", placeholder: "Unique Code"},
        validators: [
          (value) => (value ? true : "Code is required"),
          (value) => /^[a-zA-Z]+$/.test(value) || "Code can only contain English letters",
        ],
      },
    ],
  })
}

const onAddFilter = (options) => {
  const {parent, newFilter, eventType} = options;
  if (eventType === "addNewNode") {
    nodes.value.push({
      key: (nodes.value.length).toString(),
      data: {
        name: {
          uk: newFilter['name.ua'],
          ru: newFilter['name.ru']
        },
        code: newFilter.code,
        description: 'MOK Description',
        icon: '25kb',
      },
      children: []
    })
    console.log("onAddFilter", nodes.value)
    return
  }

  const activeFilter = deepSearchByCode(nodes.value, parent.key,);
  activeFilter.children.push({
    key: pathGenerator(parent),
    data: {
      name: {
        ru: newFilter['name.ru'],
        uk: newFilter['name.ua']
      },
      code: newFilter.code,
      icon: '25kb',
      description: 'Папка с проектом на Vue.js'
    },
    children: [],
  })
  console.log("onAddFilter", activeFilter)
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
      name: {
        uk: 'авіаів',
        ru: 'рапава'
      },
      code: 'root',
      icon: '100kb',
      description: 'Основная папка с данными и настройками системы.'
    },
    children: [
      {
        key: '0-0',
        data: {
          name: {
            uk: 'Vue',
            ru: 'Vue'
          },
          code: 'folder',
          icon: '25kb',
          description: 'Папка с проектом на Vue.js'
        },
        children: [
          {
            key: '0-0-0',
            data: {
              name: {
                uk: 'package.json',
                ru: 'package.json'
              },
              code: 'file',
              icon: '10kb',
              description: 'Файл конфигурации для проекта на Vue.js'
            }
          },
        ]
      },
    ]
  },
  {
    key: '1',
    data: {
      name: {
        uk: 'Хмара',
        ru: 'Облако'
      },
      code: 'folder',
      icon: '20kb',
      description: 'Папка для хранения резервных копий.'
    },
    children: [
      {
        key: '1-0',
        data: {
          name: {
            uk: 'backup-1.zip',
            ru: 'backup-1.zip'
          },
          code: 'zip',
          icon: '10kb',
          description: 'Резервная копия данных №1.'
        }
      },
      {
        key: '1-1',
        data: {
          name: {
            uk: 'backup-2.zip',
            ru: 'backup-2.zip'
          },
          code: 'zip',
          icon: '10kb',
          description: 'Резервная копия данных №2.'
        }
      }
    ]
  },
  {
    key: '2',
    data: {
      name: {
        uk: 'Робочий стіл',
        ru: 'Рабочий стол'
      },
      code: 'folder',
      icon: '150kb',
      description: 'Папка с важными текстовыми файлами.'
    },
    children: [
      {
        key: '2-0',
        data: {
          name: {
            uk: 'note-meeting.txt',
            ru: 'note-meeting.txt'
          },
          code: 'text',
          icon: '50kb',
          description: 'Заметки с собрания.'
        }
      },
      {
        key: '2-1',
        data: {
          name: {
            uk: 'note-todo.txt',
            ru: 'note-todo.txt'
          },
          code: 'text',
          icon: '100kb',
          description: 'Список задач для выполнения.'
        }
      }
    ]
  },
  {
    key: '3',
    data: {
      name: {
        uk: 'Документи',
        ru: 'Документы'
      },
      code: 'folder',
      icon: '75kb',
      description: 'Папка с рабочими и личными документами.'
    },
    children: [
      {
        key: '3-0',
        data: {
          name: {
            uk: 'Робота',
            ru: 'Работа'
          },
          code: 'folder',
          icon: '55kb',
          description: 'Документы, связанные с работой.'
        },
        children: [
          {
            key: '3-0-0',
            data: {
              name: {
                uk: 'Expenses.doc',
                ru: 'Expenses.doc'
              },
              code: 'document',
              icon: '30kb',
              description: 'Документ с расходами.'
            }
          },
          {
            key: '3-0-1',
            data: {
              name: {
                uk: 'Resume.doc',
                ru: 'Resume.doc'
              },
              code: 'resume',
              icon: '25kb',
              description: 'Резюме для поиска работы.'
            }
          }
        ]
      },
      {
        key: '3-1',
        data: {
          name: {
            uk: 'Дім',
            ru: 'Дом'
          },
          code: 'folder',
          icon: '20kb',
          description: 'Папка с личными файлами.'
        },
        children: [
          {
            key: '3-1-0',
            data: {
              name: {
                uk: 'Invoices',
                ru: 'Invoices'
              },
              code: 'text',
              icon: '20kb',
              description: 'Счета для оплаты.'
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
