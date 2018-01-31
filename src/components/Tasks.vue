<template>
  <div class="container">
    <div class="main-container">
      <section>
        <mu-appbar :title="taskTitle">
          <mu-icon-button icon="menu" slot="left" @click="openLeftBar(true)"/>
          <mu-drawer :open="showLeftBar" :docked="docked" @close="openLeftBar()" class="left-bar">
            <mu-list @itemClick="docked ? '' : openLeftBar()">
              <div class="left-header">
                <div class="left">
                  <img src="../images/uicon.jpg" class="avatar">
                  <p class="username">滴答用户</p>
                </div>
                <div class="right">
                  <mu-icon value="search" @click="toSearch" color="white"/>
                  <mu-icon value="mail" color="white"/>
                </div>
              </div>
              <div class="left-main">
                <mu-list-item v-for="(folder, index) in folderNames" :title="folder.name" :key="index" @click="chooseFolder(folder.name)">
                  <mu-icon slot="left" value="inbox"/>
                  <mu-badge :content="folder.taskNum" slot="after"/>
                </mu-list-item>
                <mu-list-item title="添加清单" @click="showAddFolder">
                  <mu-icon slot="left" value="add_circle"/>
                </mu-list-item>
              </div>
            </mu-list>
          </mu-drawer>
          <mu-icon-button icon="more_horiz" @click="openBottomSheet" slot="right"/>
          <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
            <mu-list @itemClick="chooseItem">
              <mu-list-item title="显示详情" value="showDetail"/>
              <mu-list-item :title="showCompleted ? '隐藏已完成' : '显式已完成'" value="showCompleted"/>
              <mu-list-item title="排序" value="showSort"/>
              <mu-list-item title="编辑多个任务" value="editMultiTasks"/>
            </mu-list>
          </mu-bottom-sheet>
          <mu-bottom-sheet :open="showSortSheet" @close="closeSortSheet">
            <mu-list @itemClick="chooseSortItem">
              <mu-list-item title="按时间" value="time"/>
              <mu-list-item title="按标题" value="title"/>
              <mu-list-item title="按优先级" value="priority"/>
            </mu-list>
          </mu-bottom-sheet>
        </mu-appbar>
      </section>
      <section>
        <div class="main" v-show="tasks.length">
          <div class="activeTask" v-show="tasks.length">
            <ul class="task-list">
              <task v-for="(task, index) in filteredTasks" :key="index" :task="task" :folderName="task.forderName" ></task>
            </ul>
          </div>
          <div class="completedTask" v-show="showCompleted && completedTasks.length">
            <div class="doneTitle">已完成</div>
            <ul class="task-list">
              <task v-for="(task, index) in completedTasks" :key="index" :task="task"></task>
            </ul>
          </div>
        </div>
        <mu-float-button v-show="addButtonShow" icon="add" secondary class="float-add-button" @click="showAddTask"/>
        <mu-dialog :open="dialogShow" @close="close">
          <mu-text-field v-focus :hintText="hintText" class="demo-divider-form" v-model="inputText" :underlineShow="true" @keyup.enter="addTask"/>
          <div class="icon-container">
            <mu-icon-button icon="send" size="12" class="send-right" @click="addTask"/>
          </div>
        </mu-dialog>
      </section>
      <section class="footer">
        <mu-paper>
          <mu-bottom-nav :value="bottomNav" @change="selectBottomNav">
            <mu-bottom-nav-item value="tasks" title="任务" icon="check_box"/>
            <mu-bottom-nav-item value="calendar" title="日历" icon="event"/>
            <mu-bottom-nav-item value="settings" title="我" icon="account_box"/>
          </mu-bottom-nav>
        </mu-paper>
      </section>
    </div>
  </div>
</template>

<script>
import Task from './Task'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  components: { Task },
  name: 'Tasks',
  data () {
    return {
      taskTitle: 'Welcome',
      bottomSheet: false,
      bottomNav:'tasks',
      addButtonShow:true,
      dialogShow:false,
      showSortSheet:false,
      showLeftBar:false,
      docked: false,
      inputText:'',
      hintText:'',
      addType:''
    }
  },
  directives:{
    focus:{
      inserted:function(el){
        el.focus();
      }
    }
  },
  mounted(){
    let folderName = this.$route.query.folderName || 'default';
    this.$store.dispatch('getAllFolders', {folderName});
  },
  computed: {
    ...mapGetters([
      'folderNames',
      ]
    ),
    ...mapState({
      showCompleted: state => state.config.showCompleted,
      folders: state => state.folders,
      tasks: state => state.tasks
    }),
    filteredTasks () {
      return this.tasks.filter(task => !task.done)
    },
    completedTasks() {
      return this.tasks.filter(task => task.done)
    }
  },
  methods: {
    ...mapMutations([
      'saveConfig'
    ]),
    openLeftBar(flag) {
      this.showLeftBar = !this.showLeftBar;
      this.docked = !flag
    },
    closeBottomSheet () {
      this.bottomSheet = false
    },
    openBottomSheet () {
      this.bottomSheet = true;
    },
    chooseItem(val) {
      var selected = val.value;
      switch (selected) {
        case 'showCompleted' :
          {
            this.bottomSheet = false;
            this.saveConfig({name:'showCompleted',value:!this.showCompleted});
          }; break;
        case 'showSort' :
          {
            this.bottomSheet = false;
            this.showSortSheet = true;
          }; break;
      }
    },
    chooseSortItem(val) {
      var sort = val.value;
      console.log(sort);
      this.showSortSheet = false;
    },
    selectBottomNav(val) {
      this.bottomNav = val;
      switch (val) {
        case 'tasks': this.$router.push('./Tasks');break;
        case 'calendar': this.$router.push('./Search'); break;
        case 'settings': this.$router.push('./Profile');break;
      }
    },
    closeSortSheet() {
      this.showSortSheet = false;
    },
    openSortSheet() {
      this.bottomSheet = false
      this.showSortSheet = true;
    },
    showAddTask() {
      this.hintText = '准备做什么?';
      this.addType = 'task';
      this.addButtonShow = false;
      this.dialogShow = true;
    },
    showAddFolder() {
      this.hintText = '输入清单名称';
      this.addType = 'folder';
      this.addButtonShow = false;
      this.dialogShow = true;
    },
    open () {
      this.dialogShow = true
    },
    close () {
      this.addButtonShow = true;
      this.dialogShow = false
    },
    chooseFolder(folderName) {
      this.folderName = folderName;
      this.$route.query.folderName = folderName;
      console.log(this.$route.query.folderName);
      this.$store.commit('switchFolder', { folderName })
    },
    addTask() {
      let text = this.inputText.replace(/^\s+|\s+$/, " ");
      if (!text) {
        return;
      }
      if (this.addType == 'task') {
        let folderName = this.folderName || 'default';
        // let data = {folderName:name,title:title};
        this.$store.commit('addTask', {folderName:folderName,title:text})
      } else if (this.addType == 'folder') {
        this.$store.commit('addFolder', text )
      }
      this.inputText = '';
      this.addButtonShow = true;
      this.dialogShow = false
    },
    toSearch() {
      this.$router.push('./Search')
    }
  }
}
</script>

<style scoped>
  .avatar {
    position: relative;
    width:60px;
    height:60px;
    border-radius:30px;
    margin:10px 0 0 25px;
  }
  .username {
    color:white;
    height:15px;
    line-height: 15px;
    font-size:.7rem;
    margin: -15px 0 10px 25px;
  }
  .left-bar {
    /*background: #FFCCCC;*/
  }
  .left-header {
    margin-top:-10px;
    background: #6666CC;
  }
  .left-header:after{
    content:',';
    display:block;
    height:0;
    clear:both;
    visibility:hidden;
  }
  .left {
    float:left;
  }
  .right{
    float:right;
    margin-right:30px;
  }
  .left-main {

  }
  .main {
    position: relative;
    background-color:#fff;
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
  .doneTitle {
    background: #CC99FF;
    padding:5px 0 5px 20px;
  }
  .icon-container {
    position: relative;
    height: 50px;
  }
  .send-right {
    position: absolute;
    right:0;
  }
.footer {
  position: fixed;
  bottom:0;
  left:0;
  right:0;
  z-index:100;
}
.float-add-button {
  position: fixed;
  right:20px;
  bottom:80px;
}
</style>
