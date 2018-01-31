<template>
  <section class="footer">
    <mu-paper>
      <mu-bottom-nav :value="bottomNav" @change="selectBottomNav">
        <mu-bottom-nav-item value="tasks" title="任务" icon="check_box"/>
        <mu-bottom-nav-item value="calendar" title="日历" icon="event"/>
        <mu-bottom-nav-item value="settings" title="我" icon="account_box"/>
      </mu-bottom-nav>
    </mu-paper>
  </section>
</template>

<script>
  export default {
    name: "footerGuide",
    props:['bottomNav'],
    methods:{
      selectBottomNav(val) {
        switch (val) {
          case 'tasks': this.$router.push('./tasks');break;
          case 'calendar': this.$router.push('./search'); break;
          case 'settings': this.$router.push('./profile');break;
        }
      },
    }
  }
</script>

<style scoped>
  .footer {
    position: fixed;
    bottom:0;
    left:0;
    right:0;
    z-index:200;
  }
</style>
