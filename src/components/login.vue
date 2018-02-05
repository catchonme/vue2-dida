<template>
  <div class="login-page">
    <mu-appbar>
      <mu-icon value="chevron_left" slot="left" @click="back" :size="30"/>
    </mu-appbar>
    <form class="login-form">
      <section class="input-container">
        <input type="text" placeholder="帐号" v-model.lazy="username">
      </section>
      <section class="input-container">
        <input v-if="!showPassword" type="password" placeholder="密码" v-model="password">
        <input v-else type="text" placeholder="密码" v-model="password">
        <div class="button-switch" :class="{'change-to-text':showPassword}">
          <div class="circle-button" :class="{'trans-to-right':showPassword}" @click="changePasswordType"></div>
          <span>abc</span>
          <span>...</span>
        </div>
      </section>
    </form>
    <div class="login-tips">温馨提示：未注册过的账号，登录时将自动注册</div>
    <div class="login-tips"> 注册过的用户可凭账号密码登录</div>
    <div class="login-container" @click="userLogin">登录</div>
    <mu-dialog :open="showLoginTip" title="提示" @close="closeTips(false)">
      {{tips}}
      <mu-flat-button slot="actions" primary @click="closeTips(false)" label="确定"/>
    </mu-dialog>
  </div>
</template>

<script>
  import {mapState, mapMutations} from 'vuex'
  export default {
    data() {
      return{
        showPassword: false,
        showLoginTip:false,
        username:'',
        password:'',
        tips:''
      }
    },
    computed:{
      ...mapState([
        'user'
      ])
    },
    methods:{
      ...mapMutations([
        'login'
      ]),
      changePasswordType() {
        this.showPassword = !this.showPassword;
      },
      closeTips() {
        this.showLoginTip = false;
      },
      back(){
        this.$router.push('/profile');
      },
      userLogin() {
        if (!this.username) {
          this.tips = '请输入用户名';
          this.showLoginTip = true;
          return;
        } else if (!this.password) {
          this.tips = '请输入密码';
          this.showLoginTip = true;
          return;
        }
        let username = this.username;
        let password = this.password;
        console.log(this.user);
        if (this.user.username) {
          if (this.user.username != this.username) {
            this.login({username, password});
            this.$router.push('./tasks');
          } else {
            if (this.user.password != this.password) {
              this.showLoginTip = true;
              this.tips = '密码错误';
              return;
            } else {
              this.$router.push('/tasks');
            }
          }
        } else {
          this.login({username, password});
          this.$router.push('/tasks');
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
 .login-form {
   background-color:#fff;
   .input-container {
     display: flex;
     justify-content:space-between;
     padding:.6rem .8rem;
     border-bottom:1px solid #f1f1f1;
     input {
       font-size:.7rem;
       color:#666;
     }
     button {
       font-size:.65rem;
       color:#fff;
       font-family:Helvetica Neue, Tahoma, Arial;
       padding:.28rem .4rem;
       border:1px;
       border-radius:.15rem;
     }
   }
 }
 .login-tips{
   font-size:.5rem;
   padding:.4rem .6rem;
   color:red;
   line-height:.5rem;
 }
  .login-container {
    margin:.5rem 1rem;
    font-size:.7rem;
    color:#fff;
    background: #4cd964;
    padding:.5rem 0;
    border:1px;
    border-radius:.15rem;
    text-align: center;
  }
  .button-switch{
    background:#ccc;
    display:flex;
    justify-content:center;
    width:2rem;
    height:.7rem;
    padding:0 .2rem;
    border:1px;
    border-radius:.5rem;
    position: relative;
    .circle-button {
      transition:all .3s;
      position: absolute;
      top:-0.2rem;
      z-index:1;
      left:-0.3rem;
      width:1.2rem;
      height:1.2rem;
      box-shadow:0 0.026667rem 0.053333rem 0 rgba(0,0,0,.1);
      background: #f1f1f1;
      border-radius:50%;
    }
    .trans-to-right{
      transform:translateX(1.3rem);
    }
    span{
      font-size:.45rem;
      color:#fff;
      line-height:.6rem;
    }
    span:nth-of-type(2) {
      transform:translateY(-0.08rem);
    }
  }
  .change-to-text {
    background:#4cd964;
  }
</style>
