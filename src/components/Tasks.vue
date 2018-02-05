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
                  <div v-if="username" @click="goto('/profile')">
                    <img src="../images/uicon.jpg" class="avatar">
                    <p class="username">{{username}}</p>
                  </div>
                  <div v-else @click="goto('/login')">
                    <mu-icon class="avatar" value="account_circle" color="white" :size="60"/>
                    <p class="username">登录/注册</p>
                  </div>
                </div>
                <div class="right">
                  <mu-icon value="search" @click="goto('/search')" color="white"/>
                  <mu-icon value="mail" color="white"/>
                </div>
              </div>
              <div class="left-main">
                <mu-list-item v-for="(folder, index) in folderNames" :title="folder.name | ellipsis" :key="index" @click="chooseFolder(folder.name)">
                  <mu-icon slot="left" value="inbox"/>
                  <mu-badge :content="folder.taskNum" slot="after"/>
                </mu-list-item>
                <mu-list-item title="添加清单" @click="showAddFolder">
                  <mu-icon slot="left" value="add_circle"/>
                </mu-list-item>
                <mu-list-item title="管理清单" @click="goto('/folders')">
                  <mu-icon slot="left" value="settings"/>
                </mu-list-item>
              </div>
            </mu-list>
          </mu-drawer>
          <mu-icon-button icon="more_horiz" @click="openBottomSheet" slot="right"/>
          <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
            <mu-list @itemClick="chooseItem">
              <mu-list-item :title="showCompleted ? '隐藏已完成' : '显式已完成'" value="showCompleted"/>
              <mu-list-item title="排序" value="showSort"/>
            </mu-list>
          </mu-bottom-sheet>
          <mu-bottom-sheet :open="showSortSheet" @close="closeSortSheet">
            <mu-list @itemClick="chooseSortItem">
              <mu-list-item title="按标题" value="title"/>
              <mu-list-item title="按时间" value="date"/>
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
        <mu-dialog :open="dialogShow" @close="closeAddDialog">
          <mu-text-field :hintText="hintText" v-model="inputText" :underlineShow="true" @keyup.enter="addTaskFunc"/>
          <div class="icon-container">
            <div class="icon-left" v-if="addType == 'task'">
              <mu-icon value="today" @click="chooseDate"/>
              <mu-icon value="access_time" @click="chooseTime"/>
              <mu-icon value="priority_high" @click="openChoosePriority(true)"/>
              <div class="time-picker">
                <mu-date-picker class="date" v-model="taskDate" :underlineShow="false"/>
                <mu-time-picker class="time" format="24hr" v-model="taskTime" :underlineShow="false"/>
                <mu-icon v-for="(item, index) in priority" :key="index" class="choose-priority" value="priority_high" :color="priorityColor" @click="openChoosePriority(true)"/>
              </div>
            </div>
            <div class="icon-right">
              <mu-icon value="send" @click="addTaskFunc"/>
            </div>
          </div>
        </mu-dialog>
        <mu-dialog :open="showChoosePriority" title="选择优先级" @close="openChoosePriority(false)">
          <ul class="priority-list">
            <li class="priority-item" @click="choosePriority(0)">
              <mu-radio class="priority-radio" name="priority" nativeValue="3"/>
              <mu-icon class="priority-icon" value="priority_high" color="red"/>
              <mu-icon class="priority-icon" value="priority_high" color="red"/>
              <mu-icon class="priority-icon" value="priority_high" color="red"/>
              <span class="priority-span">高</span>
            </li>
            <li class="priority-item" @click="choosePriority(1)">
              <mu-radio class="priority-radio" name="priority" nativeValue="2" />
              <mu-icon class="priority-icon" value="priority_high" color="orange"/>
              <mu-icon class="priority-icon" value="priority_high" color="orange"/>
              <span class="priority-span">中</span>
            </li>
            <li class="priority-item" @click="choosePriority(2)">
              <mu-radio class="priority-radio" name="priority" nativeValue="1" />
              <mu-icon class="priority-icon" value="priority_high"  color="blue"/>
              <span class="priority-span">低</span>
            </li>
            <li class="priority-item" @click="choosePriority(3)">
              <mu-radio class="priority-radio" name="priority" nativeValue="0"/>
              <mu-icon class="priority-icon" value="priority_high" color="gray"/>
              <mu-icon class="priority-icon" value="priority_high" color="gray"/>
              <mu-icon class="priority-icon" value="priority_high" color="gray"/>
              <span class="priority-span">无</span>
            </li>
          </ul>
          <mu-flat-button slot="actions" @click="openChoosePriority(false)" primary label="取消"/>
          <mu-flat-button slot="actions" @click="openChoosePriority(false)" primary label="确定"/>
        </mu-dialog>
      </section>
      <footer-guide bottomNav="tasks"></footer-guide>
    </div>
  </div>
</template>

<script>
import task from './task'
import footerGuide from './footerGuide'
import { mapGetters, mapMutations, mapState } from 'vuex'

export default {
  components: { task, footerGuide },
  name: 'tasks',
  data () {
    return {
      taskTitle: 'Welcome',
      bottomSheet: false,
      bottomNav:'tasks',
      addButtonShow:true,
      dialogShow:false,
      showSortSheet:false,
      showLeftBar:false,
      showChoosePriority:false,
      docked: false,
      inputText:'',
      hintText:'',
      addType:'',
      taskDate:'',
      taskTime:'',
      priority:0,
      priorityColor:''
    }
  },
  mounted(){
    let folderName = this.$route.query.folderName || '默认';
    this.$store.dispatch('initData', {folderName});
  },
  computed: {
    ...mapGetters([
      'folderNames',
      ]
    ),
    ...mapState({
      showCompleted: state => state.config.showCompleted,
      folders: state => state.folders,
      tasks: state => state.tasks,
      username: state => state.user.username
    }),
    filteredTasks : {
      get:function(){
        return this.tasks.filter(task => !task.done)
      },
      set:function(){}
    },
    completedTasks: {
      get:function () {
        return this.tasks.filter(task => task.done)
      },
      set:function(){}
    }
  },
  filters:{
    ellipsis:function (n) {
      return n.length < 8 ? n : n.substring(0,8)+'...';
    }
  },
  methods: {
    ...mapMutations([
      'saveConfig',
      'addTask',
      'addFolder',
      'switchFolder'
    ]),
    choosePriority(num) {
      let priorityRadio = document.querySelectorAll('.priority-radio input');
      switch(num) {
        case 0 :
              {
                priorityRadio[0].checked = true;
                this.priority = 3;
                this.priorityColor = 'red';
              }break;
        case 1:
              {
                priorityRadio[1].checked = true;
                this.priority = 2;
                this.priorityColor = 'orange';
              }break;
        case 2:
              {
                priorityRadio[2].checked = true;
                this.priority = 1;
                this.priorityColor = 'blue';
              }break;
        case 3:
              {
                priorityRadio[3].checked = true;
                this.priority = 0;
                this.priorityColor = 'gray';
              }break;
      }
    },
    chooseDate() {
      document.querySelector(".date input").click();
    },
    chooseTime() {
      document.querySelector(".time input").click();
    },
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
      // 优先级和时间，越大的排的越前
      if (sort == 'priority' || sort == 'date') {
        var order = -1;
      } else {
        var order = 1;
      }
      this.filteredTasks = this.filteredTasks.sort(function(a,b){
        a = a[sort];
        b = b[sort];
        return (a === b ? 0 : a > b ? 1 : -1) * order;
      });
      this.completedTasks = this.completedTasks.sort(function(a,b){
        a = a[sort];
        b = b[sort];
        return (a === b ? 0 : a > b ? 1 : -1) * order;
      })
      this.showSortSheet = false;
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
      this.priority = 0;
      this.taskDate = '';
      this.taskTime = '';
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
    closeAddDialog () {
      this.addButtonShow = true;
      this.dialogShow = false
    },
    openChoosePriority(bool) {
      bool ? this.showChoosePriority = true : this.showChoosePriority = false;
    },
    chooseFolder(folderName) {
      this.folderName = folderName;
      this.$route.query.folderName = folderName;
      this.switchFolder({folderName});
    },
    addTaskFunc() {
      let text = this.inputText.replace(/^\s+|\s+$/, " ");
      if (!text) {
        return;
      }
      if (this.addType == 'task') {
        let folderName = this.folderName || '默认';
        let taskDate = this.taskDate;
        let taskTime = this.taskTime;
        if(!taskDate && taskTime) {
          let dateArr = new Date().toLocaleDateString().split('/');
          taskDate = dateArr.map(function(val) {
            if (val < 10) {
              return '0' + val;
            } else {
              return val;
            }
          }).join('-');
        }
        let fullDate = taskDate + ' ' + taskTime
        if (fullDate) {
          var date = Date.parse(fullDate);
        } else {
          var date = '';
        }
        let priority = this.priority;
        let title = text;
        this.addTask({folderName, title, date, priority});
        this.taskDate = '';
        this.taskTime = '';
      } else if (this.addType == 'folder') {
        this.addFolder(text);
      }
      this.inputText = '';
      this.addButtonShow = true;
      this.dialogShow = false
    },
    goto(url){
      this.$router.push(url);
    }
  }
}
</script>

<style lang="scss" scoped>
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
  .icon-left {
    position: absolute;
    left:0;
  }
  .time-picker{
    position: relative;
  }
  .date {
    /*float:left;*/
    width:100px;
    overflow: hidden;
  }
  .time {
    width:50px;
    overflow: hidden;
  }
  .choose-priority {
    position: relative;
    /*left:7rem;*/
    top:-1rem;
    margin:0 -0.7rem 0 0;
    /*padding-top:0.2rem;*/
  }
  .no-priority {
    top:-.2rem;
  }
  .icon-right {
    position: absolute;
    right:0;
  }
  .float-add-button {
    position: fixed;
    right:20px;
    bottom:80px;
  }
  .priority-list {
    margin-left:1rem;
  }
  .priority-item {
    height:1.5rem;
    line-height:1.5rem;
  }
  .priority-icon {
    margin:0 -0.8rem 0 0;
  }
  .priority-span {
    margin-left:.8rem;
    position: relative;
    top:-.2rem;
  }
</style>
