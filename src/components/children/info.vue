<template>
  <div class="info-page">
    <mu-appbar class="title">
      <mu-icon value="chevron_left" slot="left" @click="back" :size="30"/>
    </mu-appbar>
    <section class="info-box">
      <router-link to="/profile/info/changeUsername" class="info-router">
        <section class="info-inline">
          <h2>用户名</h2>
          <div class="info">
            <span>{{username}}</span>
            <mu-icon value="keyboard_arrow_right" class="arrow-right" :size="30"/>
          </div>
        </section>
      </router-link>
      <router-link to="/profile/info/changePassword" class="info-router">
        <section class="info-inline">
          <h2>登录密码</h2>
          <div class="info">
            <span>修改</span>
            <mu-icon value="keyboard_arrow_right" class="arrow-right" :size="30"/>
          </div>
        </section>
      </router-link>
    </section>
    <section class="exit-login" @click="showConfirmExit = true">退出登录</section>
    <mu-dialog :open="showConfirmExit" title="提示" @close="confirmExit(false)">
      确认退出？
      <mu-flat-button slot="actions" @click="confirmExit(false)" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="confirmExit(true)" label="确定"/>
    </mu-dialog>
    <transition name="router-slide" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  export default {
    data(){
      return{
        showConfirmExit:false
      }
    },
    computed:{
      ...mapState([
        'user'
      ]),
      username:function(){
        return this.user.username;
      }
    },
    created() {
      let user = this.user;
      if (!user.username) {
        this.$router.push('/login');
      }
    },
    methods:{
      ...mapMutations([
        'loginOut'
      ]),
      confirmExit:function(confirm){
        if (confirm) {
          this.loginOut();
          this.$router.push('/login');
        } else {
          this.showConfirmExit = false;
        }
      },
      back() {
        this.$router.go(-1);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .info-page {
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
  }
  .info-box {
    width:100%;
    height:3.1rem;
    .info-inline {
      margin-top:.4rem;
      padding:.5rem .4rem;
      display: flex;
      justify-content:space-between;
      align-items:center;
      border-top:1px solid #ddd;
      background:#fff;
      h2 {
        font-size:.6rem;
        color:#333;
        display: flex;
        align-items: center;
      }
      .info {
        display: flex;
        align-items: center;
        span {
          color:#666;
        }
      }
    }
  }
  .exit-login {
    width:96%;
    margin:3rem auto 0;
    line-height:1.5rem;
    border-radius: 5px;
    text-align: center;
    background:#d8584a;
    font-size:.6rem;
    color:#fff;
  }
  .exit-login:active {
    opacity:.8;
    background:#c1c1c1;
  }
  .router-slide-enter-active, .router-slide-leave-active {
    transition:all .4s;
  }
  .router-slide-enter-active, .router-slide-leave-active {
    transform:translate3d(2rem, 0, 0);
    opacity:0;
  }
</style>
