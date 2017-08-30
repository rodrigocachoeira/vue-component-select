import Vue from 'vue'
import SelectComponent from './SelectComponent.vue';
import VueResource from 'vue-resource';

Vue.use(VueResource);
Vue.component('selectComponent', SelectComponent);

new Vue({
  el: '#app'
})
