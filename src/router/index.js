import Vue from 'vue'
import Router from 'vue-router'
import tasks from '@/components/tasks'
import search from '@/components/search'
import folders from '@/components/folders'
import login from '@/components/login'
import detail from '@/components/detail'
import profile from '@/components/profile'
import info from '@/components/children/info'
import taskCategory from '@/components/children/taskCategory'
import changeUsername from '@/components/children/children/changeUsername'
import changePassword from '@/components/children/children/changePassword'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:{name:'tasks'}
    },
    {
      path:'/tasks',
      name:'tasks',
      component:tasks
    },
    {
      path:'/search',
      name:'search',
      component:search
    },
    {
      path:'/folders',
      name:'folders',
      component:folders
    },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/detail',
      name:'detail',
      component:detail
    },{
      path:'/profile',
      name:'profile',
      component:profile,
      children:[
        {
          path:'taskCategory',
          name:'taskCategory',
          component:taskCategory
        },
        {
        path:'info',
        name:'info',
        component:info,
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
