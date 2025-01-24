<template>
  <div>
    <h1>Three</h1>
    <Button label="Add" class="add__filter-button" icon="pi pi-check" @click="addNewFilter"/>
    <Button label="Submit" icon="pi pi-check" @click="saveFilters"/>
    <TreeTable
        :value="nodes"
        :paginator="true"
        :rows="5"
        :expanded-keys="expandedKeys"
        @update:expandedKeys="updateExpandedKeys"
    >
      <Column header="Name" :expander="true" style="width: 34%">
        <template #body="{ node }">
          <div>{{ node.data.name['uk'] }}</div>
          /
          <div>{{ node.data.name['ru'] }}</div>
        </template>
      </Column>
      <Column field="code" header="Code" style="width: 15%"></Column>
      <Column field="icon" header="Icon" style="width: 15%"></Column>
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
import {createFilters} from "@/services/api/filters-service.api.js";

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

const generatePopupFields = (filter = null, isEditMode = false) => {
  return [
    {
      code: "name.ua",
      component: "InputText",
      props: {type: "text", placeholder: "Name (UA)", style: "width: 100%; margin-bottom: 15px"},
      defaultValue: isEditMode && filter ? filter.data.name.uk : "",
      validators: [(value) => (value ? true : "Name (UA) is required")],
    },
    {
      code: "name.ru",
      component: "InputText",
      props: {type: "text", placeholder: "Name (RU)", style: "width: 100%; margin-bottom: 15px"},
      defaultValue: isEditMode && filter ? filter.data.name.ru : "",
      validators: [(value) => (value ? true : "Name (RU) is required")],
    },
    {
      code: "code",
      component: "InputText",
      props: {type: "text", placeholder: "Unique Code", style: "width: 100%; margin-bottom: 15px"},
      defaultValue: isEditMode && filter ? filter.data.code : "",
      validators: [
        (value) => (value ? true : "Code is required"),
        (value) => /^[a-zA-Z]+$/.test(value) || "Code can only contain English letters",
      ],
    },
  ];
}

const handleOpenPopup = (filter = null, eventType = "add") => {
  const isEditMode = eventType === "edit";
  const title = isEditMode ? "Edit Filter" : "Add Filter";

  eventBus.emit("show-popup", {
    title,
    parentFilter: filter,
    eventType,
    fields: generatePopupFields(filter, isEditMode),
  })
}

const addNewFilter = () => {
  console.log("addNewFilter");

  handleOpenPopup(null, "addNewNode");
};

const expandedKeys = ref({});

const updateExpandedKeys = (keys) => {
  expandedKeys.value = Object.fromEntries(
      Object.entries(keys).filter(([key]) => key !== 'value')
  );
};


const onAddFilter = (options) => {
  const {parent, newFilter, eventType} = options;

  if (isInvalidParent(parent)) {
    console.error("Parent key is invalid:", parent);
    return;
  }

  if (eventType === "edit") {
    handleEditFilter(parent, newFilter);
    return;
  }

  if (!parent) {
    handleAddRootNode(newFilter);
    return;
  }

  handleAddChildNode(parent, newFilter);

}

const isInvalidParent = (parent) => parent && !parent.key;

const handleEditFilter = (parent, newFilter) => {
  const activeFilter = deepSearchByCode(nodes.value, parent?.key);
  if (!activeFilter) return;

  activeFilter.data.name.uk = newFilter['name.ua'];
  activeFilter.data.name.ru = newFilter['name.ru'];
  activeFilter.data.code = newFilter.code;
  activeFilter.data.description =
      newFilter.description || activeFilter.data.description;

  console.log("Updated activeFilter", activeFilter);
};

const handleAddRootNode = (newFilter) => {
  const newKey = nodes.value.length.toString();

  nodes.value.push({
    key: newKey,
    data: {
      name: {
        uk: newFilter['name.ua'],
        ru: newFilter['name.ru'],
      },
      code: newFilter.code,
      description: "MOK Description",
      icon: "25kb",
    },
    children: [],
  });

  console.log("Added new root node", nodes.value);
};


const handleAddChildNode = (parent, newFilter) => {
  const activeFilter = deepSearchByCode(nodes.value, parent.key);

  if (!activeFilter) {
    console.error("Active filter not found for parent key:", parent.key);
    return;
  }

  const childNode = createChildNode(parent, newFilter);
  activeFilter.children.push(childNode);

  expandedKeys.value = {...expandedKeys.value, [parent.key]: true};

};

const createChildNode = (parent, newFilter) => {
  return {
    key: pathGenerator(parent),
    data: {
      name: {
        uk: newFilter['name.ua'],
        ru: newFilter['name.ru'],
      },
      code: newFilter.code,
      icon: "25kb",
      description: "Папка с проектом на Vue.js",
    },
    children: [],
  };
};

onMounted(() => {
  eventBus.on("add-filter", onAddFilter);
});

onUnmounted(() => {
  eventBus.off("add-filter", onAddFilter);
});

const activeFilter = ref({});

const toggle = (event, node) => {
  activeFilter.value = node;
  menu.value.toggle(event);
};

const newNodeFilter = {
  filters: [{
    name: {
      uk: 'авіаів',
      ru: 'рапава'
    },
    code: 'root',
    icon: '100kb',
    description: 'Основная папка с данными и настройками системы.',
    children: [
      {
        name: {
          uk: 'Vue',
          ru: 'Vue'
        },
        code: 'folder',
        icon: '25kb',
        description: 'Папка с проектом на Vue.js',
        children: [
          {
            name: {
              uk: 'package.json',
              ru: 'package.json'
            },
            code: 'file',
            icon: '10kb',
            description: 'Файл конфигурации для проекта на Vue.js',
            children: []
          },
        ]
      },
    ]
  }]
}


const saveFilters = async () => {
  await createFilters(newNodeFilter);
}

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
            },
            children: []
          },
        ]
      },
    ]
  },
  // {
  //   key: '1',
  //   data: {
  //     name: {
  //       uk: 'Хмара',
  //       ru: 'Облако'
  //     },
  //     code: 'folder',
  //     icon: '20kb',
  //     description: 'Папка для хранения резервных копий.'
  //   },
  //   children: [
  //     {
  //       key: '1-0',
  //       data: {
  //         name: {
  //           uk: 'backup-1.zip',
  //           ru: 'backup-1.zip'
  //         },
  //         code: 'zip',
  //         icon: '10kb',
  //         description: 'Резервная копия данных №1.'
  //       }
  //     },
  //     {
  //       key: '1-1',
  //       data: {
  //         name: {
  //           uk: 'backup-2.zip',
  //           ru: 'backup-2.zip'
  //         },
  //         code: 'zip',
  //         icon: '10kb',
  //         description: 'Резервная копия данных №2.'
  //       }
  //     }
  //   ]
  // },
  // {
  //   key: '2',
  //   data: {
  //     name: {
  //       uk: 'Робочий стіл',
  //       ru: 'Рабочий стол'
  //     },
  //     code: 'folder',
  //     icon: '150kb',
  //     description: 'Папка с важными текстовыми файлами.'
  //   },
  //   children: [
  //     {
  //       key: '2-0',
  //       data: {
  //         name: {
  //           uk: 'note-meeting.txt',
  //           ru: 'note-meeting.txt'
  //         },
  //         code: 'text',
  //         icon: '50kb',
  //         description: 'Заметки с собрания.'
  //       }
  //     },
  //     {
  //       key: '2-1',
  //       data: {
  //         name: {
  //           uk: 'note-todo.txt',
  //           ru: 'note-todo.txt'
  //         },
  //         code: 'text',
  //         icon: '100kb',
  //         description: 'Список задач для выполнения.'
  //       }
  //     }
  //   ]
  // },
  // {
  //   key: '3',
  //   data: {
  //     name: {
  //       uk: 'Документи',
  //       ru: 'Документы'
  //     },
  //     code: 'folder',
  //     icon: '75kb',
  //     description: 'Папка с рабочими и личными документами.'
  //   },
  //   children: [
  //     {
  //       key: '3-0',
  //       data: {
  //         name: {
  //           uk: 'Робота',
  //           ru: 'Работа'
  //         },
  //         code: 'folder',
  //         icon: '55kb',
  //         description: 'Документы, связанные с работой.'
  //       },
  //       children: [
  //         {
  //           key: '3-0-0',
  //           data: {
  //             name: {
  //               uk: 'Expenses.doc',
  //               ru: 'Expenses.doc'
  //             },
  //             code: 'document',
  //             icon: '30kb',
  //             description: 'Документ с расходами.'
  //           }
  //         },
  //         {
  //           key: '3-0-1',
  //           data: {
  //             name: {
  //               uk: 'Resume.doc',
  //               ru: 'Resume.doc'
  //             },
  //             code: 'resume',
  //             icon: '25kb',
  //             description: 'Резюме для поиска работы.'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       key: '3-1',
  //       data: {
  //         name: {
  //           uk: 'Дім',
  //           ru: 'Дом'
  //         },
  //         code: 'folder',
  //         icon: '20kb',
  //         description: 'Папка с личными файлами.'
  //       },
  //       children: [
  //         {
  //           key: '3-1-0',
  //           data: {
  //             name: {
  //               uk: 'Invoices',
  //               ru: 'Invoices'
  //             },
  //             code: 'text',
  //             icon: '20kb',
  //             description: 'Счета для оплаты.'
  //           }
  //         }
  //       ]
  //     },
  //   ]
  // },
  // {
  //   key: '4',
  //   data: {
  //     name: {
  //       uk: 'Документи',
  //       ru: 'Документы'
  //     },
  //     code: 'folder',
  //     icon: '75kb',
  //     description: 'Папка с рабочими и личными документами.'
  //   },
  //   children: [
  //     {
  //       key: '3-0',
  //       data: {
  //         name: {
  //           uk: 'Робота',
  //           ru: 'Работа'
  //         },
  //         code: 'folder',
  //         icon: '55kb',
  //         description: 'Документы, связанные с работой.'
  //       },
  //       children: [
  //         {
  //           key: '3-0-0',
  //           data: {
  //             name: {
  //               uk: 'Expenses.doc',
  //               ru: 'Expenses.doc'
  //             },
  //             code: 'document',
  //             icon: '30kb',
  //             description: 'Документ с расходами.'
  //           }
  //         },
  //         {
  //           key: '3-0-1',
  //           data: {
  //             name: {
  //               uk: 'Resume.doc',
  //               ru: 'Resume.doc'
  //             },
  //             code: 'resume',
  //             icon: '25kb',
  //             description: 'Резюме для поиска работы.'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       key: '3-1',
  //       data: {
  //         name: {
  //           uk: 'Дім',
  //           ru: 'Дом'
  //         },
  //         code: 'folder',
  //         icon: '20kb',
  //         description: 'Папка с личными файлами.'
  //       },
  //       children: [
  //         {
  //           key: '3-1-0',
  //           data: {
  //             name: {
  //               uk: 'Invoices',
  //               ru: 'Invoices'
  //             },
  //             code: 'text',
  //             icon: '20kb',
  //             description: 'Счета для оплаты.'
  //           }
  //         }
  //       ]
  //     },
  //   ]
  // },
  // {
  //   key: '5',
  //   data: {
  //     name: {
  //       uk: 'Документи',
  //       ru: 'Документы'
  //     },
  //     code: 'folder',
  //     icon: '75kb',
  //     description: 'Папка с рабочими и личными документами.'
  //   },
  //   children: [
  //     {
  //       key: '3-0',
  //       data: {
  //         name: {
  //           uk: 'Робота',
  //           ru: 'Работа'
  //         },
  //         code: 'folder',
  //         icon: '55kb',
  //         description: 'Документы, связанные с работой.'
  //       },
  //       children: [
  //         {
  //           key: '3-0-0',
  //           data: {
  //             name: {
  //               uk: 'Expenses.doc',
  //               ru: 'Expenses.doc'
  //             },
  //             code: 'document',
  //             icon: '30kb',
  //             description: 'Документ с расходами.'
  //           }
  //         },
  //         {
  //           key: '3-0-1',
  //           data: {
  //             name: {
  //               uk: 'Resume.doc',
  //               ru: 'Resume.doc'
  //             },
  //             code: 'resume',
  //             icon: '25kb',
  //             description: 'Резюме для поиска работы.'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       key: '3-1',
  //       data: {
  //         name: {
  //           uk: 'Дім',
  //           ru: 'Дом'
  //         },
  //         code: 'folder',
  //         icon: '20kb',
  //         description: 'Папка с личными файлами.'
  //       },
  //       children: [
  //         {
  //           key: '3-1-0',
  //           data: {
  //             name: {
  //               uk: 'Invoices',
  //               ru: 'Invoices'
  //             },
  //             code: 'text',
  //             icon: '20kb',
  //             description: 'Счета для оплаты.'
  //           }
  //         }
  //       ]
  //     },
  //   ]
  // },
]);

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


</script>


<style scoped>
.add__filter-button {
  margin: 0 10px;
}
</style>
