<template>
  <div>
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
    <section class="footer">
      <mu-paper>
        <mu-bottom-nav :value="bottomNav" @change="handleChange">
          <mu-bottom-nav-item value="tasks" title="任务" icon="check box"/>
          <mu-bottom-nav-item value="calendar" title="日历" icon="event"/>
          <mu-bottom-nav-item value="settings" title="设置" icon="settings"/>
        </mu-bottom-nav>
      </mu-paper>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Tasks',
  data () {
    return {
      taskTitle: 'Welcome',
      bottomSheet: false,
      bottomNav:'recents'
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
    handleChange(val) {
      this.bottomNav = val;
    }
  }
}
</script>

<style scoped>
.footer {
  position: fixed;
  bottom:0;
  left:0;
  right:0;
  z-index:100;
}
</style>
