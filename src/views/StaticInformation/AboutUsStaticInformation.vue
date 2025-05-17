<template>
  <div class="page-container">
    <StaticInfoBlock
        :config="blockList.staticItems"
        :data="data"
        ref="staticInfoBlock"
    />
    <FooterActionBlock
        :config="blockList.footerActions"
        :data="detailsPageData"
        @submit="collectDataFromComponents"
        @cancel="router.go(-1)"
    />
  </div>
</template>

<script setup>
import {computed, defineProps, onMounted, onUnmounted, reactive, ref, watch} from 'vue';
import {DETAILS_PAGES} from "@/constants/pages.enum.js";
import FooterActionBlock from "@/components/DetailsPage/Blocks/FooterActionBlock.vue";
import {useRoute, useRouter} from "vue-router";
import FieldsBlock from "@/components/DetailsPage/Blocks/FieldsBlock.vue";
import {createStaticPage, updateExistPageBySlug} from "@/services/api/static-information.js";
import StaticInfoBlock from "@/components/DetailsPage/Blocks/StaticInfoBlock.vue";

const props = defineProps({
  blockList: {
    type: Object,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  startLoading: {
    type: Function,
    required: true,
  },
  stopLoading: {
    type: Function,
    required: true,
  },
  useFetch: {
    type: Function,
    required: false,
  }
});

const route = useRoute();

const data = {
  slug: "shipping-and-payment",
  accordion: true,
  content: [
    {
      title: "Вибір товару",
      blocks: [
        {
          blockTitle: "Ви можете допомогти мені з вибором правильного товару?",
          blockContent: `<p><span style="color: rgb(0, 0, 0);">Ми завжди раді допомогти вам у виборі необхідних добавок, продуктів та аксесуарів, які представлені на нашому сайті. Вам буде достатньо звернутися до нашої служби підтримки за телефоном 0800216969,  Telegram: </span><u style="color: rgb(255, 65, 0);"><a href="https://t.me/gymbeamuasupport" rel="noopener noreferrer" target="_blank">+380 96 099 02 99</a></u><span style="color: rgb(0, 0, 0);"> або написати нам на пошту info@gymbeam.ua. Ми завжди раді відповісти на будь-які ваші запитання.</span></p>`
        },
        {
          blockTitle: "Як я можу отримати інформацію про наявність продуктів, які цікавлять мене?",
          blockContent: `<p><span style="color: rgb(0, 0, 0);">Ви можете дізнатися про наявність продукту на на сайті, якщо його немає в наявності, там же ви можете знайти найближчу дату доставки, якщо ви не знайшли цікаву для вас інформацію на сайті - ви можете дізнатися цю інформацію у служби підтримки за допомогою email: info@gymbeam.ua або за телефоном 0800216969,Telegram: </span><u style="color: rgb(255, 65, 0);"><a href="https://t.me/gymbeamuasupport" rel="noopener noreferrer" target="_blank">+380 96 099 02 99</a></u></p>`
        },
        {
          blockTitle: "Що означає \"звичайна ціна\" вказана на продуктах??",
          blockContent: `<p><span style="color: rgb(0, 0, 0);">Звичайна ціна, це сума, за яку ви зможете купити такий самий продукт в інших інтернет магазинах. GymBeam гарантує вам найкращі ціни.</span></p>`
        }
      ]
    },
    {
      title: "Реєстрація та процес оформлення замовлення",
      blocks: [
        {
          blockTitle: "Чи обов'язково реєструватися на сайті для оформлення замовлення?",
          blockContent: `<p><span style="color: rgb(0, 0, 0);">Ні, достатньо заповнити всю інформацію для доставки під час оформлення замовлення. Але мати свій особистий кабінет набагато зручніше, за допомогою нього ви зможете дізнаватися актуальний статус вашого замовлення, а також інформацію про новинки, знижки та акції.</span></p>`
        }
      ]
    }
  ]
};

const detailsPageData = computed(() => {
  return props.data[DETAILS_PAGES.STATIC_INFO_ABOUT_US];
});

const lastSegment = computed(() => {
  const segments = route.path.split('/')
  const filtered = segments.filter(Boolean)
  return filtered[filtered.length - 1] || null
})

const pageSlug = computed(() => lastSegment.value)

const router = useRouter()

const fieldsBlockRef = ref(null);

const staticInfoBlock = ref(null);

const allData = ref({});

const collectDataFromComponents = async (e) => {
  allData.value = {
    ...staticInfoBlock.value.getData(),
  };

  console.log("allData", allData.value);

  // if (!detailsPageData.value) {
  //   await createStaticPage({
  //     slug: pageSlug.value,
  //     title: allData.value.title,
  //     locale: 'uk',
  //     content: allData.value.content,
  //   })
  // } else {
  //   await updateExistPageBySlug(pageSlug.value, {
  //     slug: pageSlug.value,
  //     title: allData.value.title,
  //     locale: 'uk',
  //     content: allData.value.content,
  //   })
  // }


};


</script>

<style scoped>
.page-container {
  position: relative;
}
</style>
