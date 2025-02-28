import { createApp } from 'vue'
import pinia from '../src/stores/index'

import noSpecialChars from '../src/function/noSpecialChars'
import NoSpecialPassword from './function/noSpecialPassword'
import NoSpecialEmail from './function/noSpecialEmail'
import NoSpecialCaptcha from './function/noSpecialCaptcha'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(pinia)

app.directive('no-special-chars', noSpecialChars)
app.directive('no-Special-Password', NoSpecialPassword)
app.directive('no-special-email', NoSpecialEmail)
app.directive('no-special-captcha', NoSpecialCaptcha)
app.use(router)
app.mount('#app')
