import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueSimpleAlert from "vue-simple-alert";

Vue.use(VueSimpleAlert);

import App from './App.vue'
import router from './router'
import store from './store'
import { auth } from './firebase'
import './assets/scss/app.scss'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

let app
auth.onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }

  if (user) {
    store.dispatch('fetchUserProfile', user)
    store.dispatch('fetchLotteryList', user)
  }
})