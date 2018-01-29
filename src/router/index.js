import Vue from 'vue'
import Router from 'vue-router'
import Tasks from '@/components/Tasks'
import Search from '@/components/Search'
import Detail from '@/components/Detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:{name:'Tasks'}
    },
    {
      path:'/tasks',
      name:'Tasks',
      component:Tasks
    },
    {
      path:'/search',
      name:'Search',
      component:Search
    },
    {
      path:'/detail',
      name:'Detail',
      component:Detail
    }
  ]
})
