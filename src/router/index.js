import Vue from 'vue'
import Router from 'vue-router'
import Tasks from '@/components/tasks'
import Search from '@/components/search'
import Detail from '@/components/detail'
import Profile from '@/components/profile'
import Info from '@/components/children/info'
import changeUsername from '@/components/children/children/changeUsername'
import changePassword from '@/components/children/children/changePassword'

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
    },{
      path:'/profile',
      name:'Profile',
      component:Profile,
      children:[{
        path:'/info',
        name:'Info',
        component:Info,
        children:[{
          path:'changeUsername',
          name:'changeUsername',
          component:changeUsername
        },{
          path:'changePassword',
          name:'changePassword',
          component:changePassword
        }]
      }]
    }
  ]
})
