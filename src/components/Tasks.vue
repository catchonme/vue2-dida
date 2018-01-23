<template>
  <div>
    <div class="left-container">

    </div>
    <div class="main-container">
      <section>
        <mu-appbar :title="taskTitle">
          <mu-icon-button icon="menu" slot="left"/>
          <mu-icon-button icon="more_horiz" @click="openBottomSheet" slot="right"/>
          <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
            <mu-list @itemClick="chooseItem">
              <mu-list-item title="显示详情" value="showDetail"/>
              <mu-list-item title="显示已完成" value="showDone"/>
              <mu-list-item title="排序" value="sortList"/>
              <mu-list-item title="编辑多个任务" value="editMultiTasks"/>
            </mu-list>
          </mu-bottom-sheet>
        </mu-appbar>
      </section>
      <section>
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
import { mapMutations } from 'vuex'
export default {
  name: 'Tasks',
  data () {
    return {
      taskTitle: 'Welcome',
      bottomSheet: false,
      bottomNav:'recents',
      addButtonShow:true,
      dialogShow:false,
      todoText:''
    }
  },
  computed: {
    todos() {
      return this.$store.state.todos
    }
  },
  methods: {
    closeBottomSheet () {
      this.bottomSheet = false
    },
    openBottomSheet () {
      this.bottomSheet = true;
    },
    chooseItem(val) {
      this.bottomSheet = true;
      console.log(val.value);
    },
    selectBottomNav(val) {
      this.bottomNav = val;
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
