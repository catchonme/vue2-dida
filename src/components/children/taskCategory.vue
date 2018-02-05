<template>
  <div class="category-page">
    <mu-appbar>
      <mu-icon value="chevron_left" slot="left" @click="back" :size="30"/>
    </mu-appbar>
    <section class="category-box">
      <div v-show="filteredTasks.length">
        <ul class="task-list">
          <task v-for="(task, index) in filteredTasks" :key="index" :task="task" :folderName="task.forderName" ></task>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
  import task from '../task'
  import { mapState } from 'vuex'
  export default {
    components:{task},
    computed:{
      ...mapState([
        'folders'
      ]),
      filteredTasks:function(){
        let folders = this.folders;
        let filteredTasks = [];
        let category = this.$route.query.category;
        switch (category) {
          case 'completed' :
          {
            folders.forEach(function(folder){
              folder.tasks.forEach(function(task, index){
                if (task.done) {
                  filteredTasks.push({taskIndex:index, title:task.title, done:task.done, date:task.date, folderName:folder.name});
                }
              })
            })
          };break;
          case 'uncompleted' :
          {
            let timeNow = (new Date).getTime();
            folders.forEach(function(folder) {
              folder.tasks.forEach(function(task, index){
                if (!task.done && ((!task.date) || (task.date > timeNow))) {
                  filteredTasks.push({taskIndex:index, title:task.title, done:task.done, date:task.date, folderName:folder.name});
                }
              })
            })
          }break;
          case 'overdue' :
          {
            let timeNow = (new Date).getTime();
            folders.forEach(function(folder) {
              folder.tasks.forEach(function(task, index){
                if (!task.done && task.date && task.date < timeNow) {
                  filteredTasks.push({taskIndex:index, title:task.title, done:task.done, date:task.date, folderName:folder.name});
                }
              })
            })
          };break;
        }
        return filteredTasks;
      }
    },
    methods:{
      back() {
        this.$router.push('/profile');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .category-page {
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    background: #f2f2f2;
    z-index:100;
    p, span {
      font-family:Helvetica Neue, Tahoma, Arial;
    }
    .category-box{
      background: #fff;
    }
  }
  .task-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .task-list li {
    position: relative;
    font-size: 24px;
    border-bottom: 1px solid #ededed;
  }
</style>
