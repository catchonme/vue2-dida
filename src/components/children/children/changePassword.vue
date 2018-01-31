<template>
  <div class="info-page">
    <mu-appbar class="title">
      <mu-icon value="chevron_left" slot="left" @click="back" :size="30"/>
    </mu-appbar>
    <form class="resetForm">
      <section class="input-container">
        <input type="text" placeholder="旧密码" name="oldPassword" v-model="oldPassword">
      </section>
      <section class="input-container">
        <input type="text" placeholder="请输入新密码" name="newPassword" v-model="newPassword">
      </section>
      <section class="input-container">
        <input type="text" placeholder="请确认输入密码" name="confirmPassword" v-model="confirmPassword">
      </section>
    </form>
    <div class="confirm-update" @click="confirmUpdate">确认修改</div>
    <mu-dialog :open="showConfirmUpdate" title="提示" @close="closeTips(false)">
      {{tips}}
      <mu-flat-button slot="actions" primary @click="closeTips(false)" label="确定"/>
    </mu-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        oldPassword:'',
        newPassword:'',
        confirmPassword:'',
        showConfirmUpdate:false,
        tips:'',
      }
    },
    methods:{
      confirmUpdate() {
        if (!this.oldPassword) {
          this.tips = '请输入旧密码';
          this.showConfirmUpdate = true;
          return;
        } else if (!this.newPassword) {
          this.tips = '请输入新密码';
          this.showConfirmUpdate = true;
          return;
        } else if (!this.confirmPassword) {
          this.tips = '请输入确认密码';
          this.showConfirmUpdate = true;
          return;
        } else if(this.newPassword != this.confirmPassword){
          this.tips = '两次输入的密码不一致';
          this.showConfirmUpdate = true;
          return;
        }
        console.log(this.newPassWord);return;
        // 修改密码
      },
      closeTips:function(){
        this.showConfirmUpdate = false;
        this.tips = '';
      },
      back() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .info-page {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    background: #f2f2f2;
    p, span {
      font-family: Helvetica Neue, Tahoma, Arial;
    }
    .resetForm {
      background:#fff;
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
          font-family: Helvetica Neue, Tahoma, Arial;
          border:1px;
          border-radius:.15rem;
        }

      }
    }
    .confirm-update {
      margin:1rem .5rem;
      font-size:.7rem;
      color:#fff;
      background:#4cd964;
      padding:.5rem 0;
      border:1px;
      border-radius:.15rem;
      text-align:center;
    }
  }
</style>
