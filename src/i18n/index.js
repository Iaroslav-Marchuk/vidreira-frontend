// import i18n from 'i18next';
// import { initReactI18next } from 'react-i18next';

// import EN_navigation from './locales/en/navigation.json';
// import PT_navigation from './locales/pt/navigation.json';
// import UK_navigation from './locales/uk/navigation.json';

// import EN_buttons from './locales/en/buttons.json';
// import PT_buttons from './locales/pt/buttons.json';
// import UK_buttons from './locales/uk/buttons.json';

// import EN_tosts from './locales/en/tosts.json';
// import PT_tosts from './locales/pt/tosts.json';
// import UK_tosts from './locales/uk/tosts.json';

// import EN_local from './locales/en/local.json';
// import PT_local from './locales/pt/local.json';
// import UK_local from './locales/uk/local.json';

// import EN_roles from './locales/en/roles.json';
// import PT_roles from './locales/pt/roles.json';
// import UK_roles from './locales/uk/roles.json';

// import EN_formik from './locales/en/formik.json';
// import PT_formik from './locales/pt/formik.json';
// import UK_formik from './locales/uk/formik.json';

// import EN_summary from './locales/en/summary.json';
// import PT_summary from './locales/pt/summary.json';
// import UK_summary from './locales/uk/summary.json';

// import EN_history from './locales/en/history.json';
// import PT_history from './locales/pt/history.json';
// import UK_history from './locales/uk/history.json';

// import EN_orderForm from './locales/en/orderForm.json';
// import PT_orderForm from './locales/pt/orderForm.json';
// import UK_orderForm from './locales/uk/orderForm.json';

// import EN_AuthPage from './locales/en/authPage.json';
// import PT_AuthPage from './locales/pt/authPage.json';
// import UK_AuthPage from './locales/uk/authPage.json';

// import EN_HomePage from './locales/en/homePage.json';
// import PT_HomePage from './locales/pt/homePage.json';
// import UK_HomePage from './locales/uk/homePage.json';

// import EN_NotFoundPage from './locales/en/notFoudPage.json';
// import PT_NotFoundPage from './locales/pt/notFoudPage.json';
// import UK_NotFoundPage from './locales/uk/notFoudPage.json';

// import EN_OrdersPage from './locales/en/ordersPage.json';
// import PT_OrdersPage from './locales/pt/ordersPage.json';
// import UK_OrdersPage from './locales/uk/ordersPage.json';

// import EN_ArchivePage from './locales/en/archivePage.json';
// import PT_ArchivePage from './locales/pt/archivePage.json';
// import UK_ArchivePage from './locales/uk/archivePage.json';

// import EN_ProfilePage from './locales/en/profilePage.json';
// import PT_ProfilePage from './locales/pt/profilePage.json';
// import UK_ProfilePage from './locales/uk/profilePage.json';

// import EN_StatsPage from './locales/en/statsPage.json';
// import PT_StatsPage from './locales/pt/statsPage.json';
// import UK_StatsPage from './locales/uk/statsPage.json';

// i18n.use(initReactI18next).init({
//   lng: localStorage.getItem('lang') || 'pt',
//   fallbackLng: 'pt',
//   resources: {
//     en: {
//       translation: {
//         ...EN_navigation,
//         ...EN_buttons,
//         ...EN_tosts,
//         ...EN_local,
//         ...EN_roles,
//         ...EN_formik,
//         ...EN_summary,
//         ...EN_history,
//         ...EN_orderForm,
//         ...EN_AuthPage,
//         ...EN_HomePage,
//         ...EN_NotFoundPage,
//         ...EN_OrdersPage,
//         ...EN_ArchivePage,
//         ...EN_ProfilePage,
//         ...EN_StatsPage,
//       },
//     },
//     pt: {
//       translation: {
//         ...PT_navigation,
//         ...PT_buttons,
//         ...PT_tosts,
//         ...PT_local,
//         ...PT_roles,
//         ...PT_formik,
//         ...PT_summary,
//         ...PT_history,
//         ...PT_orderForm,
//         ...PT_AuthPage,
//         ...PT_HomePage,
//         ...PT_NotFoundPage,
//         ...PT_OrdersPage,
//         ...PT_ArchivePage,
//         ...PT_ProfilePage,
//         ...PT_StatsPage,
//       },
//     },
//     uk: {
//       translation: {
//         ...UK_navigation,
//         ...UK_buttons,
//         ...UK_tosts,
//         ...UK_local,
//         ...UK_roles,
//         ...UK_formik,
//         ...UK_summary,
//         ...UK_history,
//         ...UK_orderForm,
//         ...UK_AuthPage,
//         ...UK_HomePage,
//         ...UK_NotFoundPage,
//         ...UK_OrdersPage,
//         ...UK_ArchivePage,
//         ...UK_ProfilePage,
//         ...UK_StatsPage,
//       },
//     },
//   },
//   interpolation: {
//     escapeValue: false,
//   },
// });

// export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

const savedLang = localStorage.getItem('lang') || 'pt';

// i18n
//   .use(HttpBackend)
//   .use(initReactI18next)
//   .init({
//     lng: savedLang,
//     fallbackLng: 'pt',
//     backend: {
//       loadPath: '/locales/{{lng}}/{{ns}}.json',
//     },

//     ns: [
//       'navigation',
//       'buttons',
//       'tosts',
//       'local',
//       'roles',
//       'formik',
//       'summary',
//       'history',
//       'orderForm',
//       'authPage',
//       'homePage',
//       'notFoudPage',
//       'ordersPage',
//       'archivePage',
//       'profilePage',
//       'statsPage',
//     ],
//     defaultNS: 'navigation',

//     react: {
//       useSuspense: false,
//     },

//     initImmediate: false,
//     interpolation: {
//       escapeValue: false,
//     },
//   });

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: savedLang,
    fallbackLng: 'pt',

    backend: {
      loadPath: '/locales/{{lng}}/*.json',
    },

    interpolation: { escapeValue: false },
  });

export default i18n;
