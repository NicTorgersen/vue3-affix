import './assets/main.css'

import affix from '@unnamed-nic/vue3-affix';

import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App);

app.directive("affix", affix);

app.mount('#app');
