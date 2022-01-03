import { createApp } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faGitAlt } from '@fortawesome/free-brands-svg-icons'
import App from './App.vue'
import router from './router'
import store from './store'


library.add(fas, faGitAlt, faStar)

createApp(App)
    .use(store)
    .use(router)
    .component('fa', FontAwesomeIcon)
    .mount('#app')
