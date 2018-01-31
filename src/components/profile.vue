<template>
  <div>
    <mu-appbar title="设置" class="title"></mu-appbar>
    <section>
      <section class="profile">
        <router-link :to="userInfo && userInfo.user_id ? '/profile/info' : '/login'" class="profile-link">
          <!--<img :src="userInfo.avatar" class="avatar" v-if="userInfo && userInfo.user_id">-->
          <mu-icon class="avatar" value="account_circle" color="white" :size="60"/>
          <div class="user-info">
            <p>{{username}}</p>
            <p><mu-icon value="phone_iphone" color="white" class="phone-icon"/>{{mobile}}</p>
          </div>
          <mu-icon value="keyboard_arrow_right" color="white" class="arrow-right" :size="30"/>
        </router-link>
      </section>
      <section class="data">
        <ul class="clear">
          <router-link to="/completed" tag="li" class="data-link">
            <span class="data-top"><b>{{completedNum}}</b></span>
            <span class="data-bottom">已完成</span>
          </router-link>
          <router-link to="/uncompleted" tag="li" class="data-link">
            <span class="data-top"><b>{{unCompletedNum}}</b></span>
            <span class="data-bottom">未完成</span>
          </router-link>
          <router-link to="/overdue" tag="li" class="data-link">
            <span class="data-top"><b>{{overdueNum}}</b></span>
            <span class="data-bottom">已过期</span>
          </router-link>
        </ul>
      </section>
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
    <transition name="router-slide" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data() {
      return{
        userInfo:{user_id:'123',avatar:'123'},
        username:'jack',
        mobile:13545781245,
        completedNum:0,
        unCompletedNum:0,
        overdueNum:0,
        bottomNav:'settings',
      }
    },
    computed:{
      ...mapState([
        'folders'
      ])
    },
    created(){
      let folders = this.folders;
      let completedNum = 0;
      let unCompletedNum = 0;
      let overdueNum = 0;
      folders.forEach(function(folder){
        folder.tasks.forEach(function(task){
          if (task.done) {
            completedNum += 1;
          } else {
            unCompletedNum += 1;
          }
        })
      })
      this.completedNum = completedNum;
      this.unCompletedNum = unCompletedNum;
      this.overdueNum = overdueNum;
    },
    methods:{
      selectBottomNav(val) {
        this.bottomNav = val;
        switch (val) {
          case 'tasks': this.$router.push('./Tasks');break;
          case 'calendar': this.$router.push('./Search'); break;
          case 'settings': this.$router.push('./Profile');break;
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  .title {
    /*background: white;*/
    color:white;
    text-align: center;
  }
  .profile {
    /*padding-top:1.95rem;*/
    .profile-link {
      /*display:block;*/
      display:flex;
      align-item:center;
      background:#6666CC;
      padding:.666667rem .6rem;
      .avatar {
        display:inline-block;
        widht:2.5rem;
        height:2.5rem;
        border-radius:50%;
        vertical-align:middle;
      }
      .user-info{
        margin-left:.48rem;
        flex-grow:1;
        p {
          font-weight:700;
          font-size:.8rem;
          color:#fff;
          .phone-icon {
            /*display: flex;*/
            /*align-items: center;*/
            position: relative;
            top:.2rem;
          }
        }
        p:nth-of-type(1) {
          margin-left:.2rem;
        }
      }
    }
    .arrow-right {
      position: relative;
      top:.6rem;
      /*display: flex;*/
      /*align-items: center;*/
    }
  }
  .data{
    width:100%;
    background:#fff;
    box-sizing:border-box;
    ul {
      .data-link {
        float:left;
        width:33.33%; // 可以使用 flex布局试试
        display:inline-block;
        border-right:1px solid #f1f1f1;
        span {
          display:block;
          width:100%;
          text-align:center;
        }
        .data-top {
          font-size:.55rem;
          color:#333;
          padding:.853333rem 0 .453333rem;
          b {
            display:inline-block;
            font-size:1.2rem;
            color:#f90;
            font-weight:700;
            line-height:1rem;
            font-family:Helvetica Neue, Tahoma;
          }
        }
        .data-bottom {
          font-size:.57333rem;
          color:#666;
          font-weight:400;
          padding-bottom:.453333rem;
        }
      }
      .data-link:nth-of-type(2){
        .data-top {
          b {
            color:#ff5f3e;
          }
        }
      }
      .data-link:nth-of-type(3){
        border:0;
        .data-top{
          b{
            color:#6ac20b;
          }
        }
      }
    }
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

  .router-slide-enter-active, .router-slide-leave-active {
    transtion:all .4s;
  }
  .router-slide-enter, .router-slide-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity:0;
  }
</style>
