import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Tester from '../components/Tester.vue'

const routes = [
    {
        name: 'Home',
        path: '/',
        component: Home
    },
    {
        name: 'Test',
        path: '/test',
        component: Tester
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
