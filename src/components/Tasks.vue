<template>
  <div class="container">
    <div class="main-container">
      <section>
        <mu-appbar :title="taskTitle">
          <mu-icon-button icon="menu" slot="left" @click="openLeftBar(true)"/>
          <mu-drawer :open="showLeftBar" :docked="docked" @close="openLeftBar()" class="left-bar">
            <mu-list @itemClick="docked ? '' : openLeftBar()">
              <mu-list-item for="fold in folders" title="fold.name" />
            </mu-list>
          </mu-drawer>
          <mu-icon-button icon="more_horiz" @click="openBottomSheet" slot="right"/>
          <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
            <mu-list @itemClick="chooseItem">
              <mu-list-item title="显示详情" value="showDetail"/>
              <mu-list-item title="显示已完成" value="showCompleted"/>
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
        <div class="main" v-show="todos.length">
          <div class="activeTodo" v-show="todos.length">
            <ul class="todo-list">
              <todo v-for="(todo, index) in filteredTodos" :key="index" :todo="todo"></todo>
            </ul>
          </div>
          <div class="completedTodo" v-show="showCompleted">
            <div class="doneTitle">已完成</div>
            <ul class="todo-list">
              <todo v-for="(todo, index) in completedTodo" :key="index" :todo="todo"></todo>
            </ul>
          </div>
        </div>
        <mu-float-button v-show="addButtonShow" icon="add" secondary class="float-add-button" @click="addTask"/>
        <mu-dialog :open="dialogShow" @close="close">
          <mu-text-field hintText="准备做什么" class="demo-divider-form" v-model="todoText" :underlineShow="true" @keyup.enter="addTodo"/>
          <div class="icon-container">
            <mu-icon-button icon="send" size="12" class="send-right" @click="addTodo"/>
          </div>
        </mu-dialog>
      </section>
      <section class="footer">
        <mu-paper>
          <mu-bottom-nav :value="bottomNav" @change="selectBottomNav">
            <mu-bottom-nav-item value="tasks" title="任务" icon="check box"/>
            <mu-bottom-nav-item value="calendar" title="日历" icon="event"/>
            <mu-bottom-nav-item value="settings" title="设置" icon="settings"/>
          </mu-bottom-nav>
        </mu-paper>
      </section>
    </div>
  </div>
</template>

<script>
import Todo from './Todo'

export default {
  components: { Todo },
  name: 'Tasks',
  data () {
    return {
      taskTitle: 'Welcome',
      bottomSheet: false,
      bottomNav:'tasks',
      addButtonShow:true,
      dialogShow:false,
      showCompleted:false,
      showSortSheet:false,
      showLeftBar:false,
      docked: false,
      todoText:'',
    }
  },
  computed: {
    folders() {
      return this.$store.state.folders
    },
    todos() {
      return this.$store.state.todos
    },
    filteredTodos () {
      return this.todos.filter(todo => !todo.done)
    },
    completedTodo() {
      return this.todos.filter(todo => todo.done)
    }
  },
  methods: {
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
            if(this.showCompleted) {
              this.showCompleted = false;
            } else {
              this.showCompleted = true;
            }
            this.bottomSheet = false;
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
    },
    closeSortSheet() {
      this.showSortSheet = false;
    },
    openSortSheet() {
      this.bottomSheet = false
      this.showSortSheet = true;
    },
    addTask() {
      this.addButtonShow = false;
      this.dialogShow = true
    },
    open () {
      this.dialogShow = true
    },
    close () {
      this.addButtonShow = true;
      this.dialogShow = false
    },
    addTodo() {
      var text = this.todoText.replace(/^\s+|\s+$/, " ");
      if (text) {
        this.$store.commit('addTodo', { text })
      }
      this.todoText = '';
      console.log(this.$store.state.todos)
      this.addButtonShow = true;
      this.dialogShow = false
    }
  }
}
</script>

<style scoped>
  .left-bar {
    background: #FFCCCC;
  }
  .main {
    position: relative;
  }
  .todo-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .todo-list li {
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
