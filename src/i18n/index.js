import {createI18n} from 'vue-i18n';
import {en} from '@/locales/en.js';
import {ru} from '@/locales/ru.js';
import {uk} from '@/locales/uk.js';

const savedLocale = localStorage.getItem('locale') || 'ru';

const i18n = createI18n({
    legacy: false,
    locale: savedLocale,
    fallbackLocale: 'en',
    messages: { en, ru , uk },
});

export default i18n;

export function t(key, params = {}) {
    return i18n.global.t(key, params);
}