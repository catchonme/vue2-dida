<template>
  <div class="info-page">
    <mu-appbar class="title">
      <mu-icon value="chevron_left" slot="left" @click="back" :size="30"/>
    </mu-appbar>
    <section class="input-box">
      <section class="box-top">
        <input type="text" placeholder="输入用户名" :class="{'input-inline':bordercolor}" @input="inputListen" v-model="inputValue">
        <div>
          <p v-if="warn">用户名只能修改一次(5-24字符之间)</p>
          <p class="warn-info" v-else>用户名在5-24位之间</p>
        </div>
      </section>
      <section class="reset">
        <button :class="{'font-opacity':opacityall}" @click="resetName">确认修改</button>
      </section>
    </section>
  </div>
</template>

<script>
  export default {
    data() {
      return{
        warn:true,
        bordercolor:false,
        opacity:false,
        inputValue:'',
        newusername:'',
        opacityall:false,
      }
    },
    methods:{
      back(){
        this.$router.go(-1);
      },
      inputListen(){
        if (this.inputValue.length < 5 || this.inputValue.length > 24) {
          this.warn = false;
          this.bordercolor = true;
          this.opacityall = false;
        } else {
          this.warn = true;
          this.bordercolor = false;
          this.opacityall = true;
        }
      },
      resetName() {
        console.log(this.inputValue);
        return;
      }
    }
  }
</script>

<style lang="scss" scoped>
.info-page {
  position: absolute;
  top:0;
  left:0;
  bottom:0;
  right:0;
  z-index:100;
  background:#f2f2f2;
  p, span {
    font-family:Helvetica Neue, Tahoma, Arial;
  }
  .input-box {
    width:15.2rem;
    margin:0 auto;
    .box-top {
      padding-top:.4rem;
      input {
        background:none;
        width:15.2rem;
        border:1px solid #ddd;
        border-radius: 2px;
        padding:.2rem .1rem;
        line-height:1.2rem;
        font-size:.7rem;
        display: block;
      }
      .input-inline {
        border-color:#ea3106;
      }
      p {
        width:100%;
        font-size:.4rem;
        color:#666;
        padding:.4rem 0 1rem;
      }
      .warn-info {
        font-size:.58rem;
        color:#ea3106;
        padding-top:.1rem;
      }
    }
    .reset {
      width:100%;
      background:#3199e8;
      button {
        display:block;
        width:100%;
        background:none;
        line-height:2rem;
        font-size:0.8rem;
        color:#fff;
        opacity:.6;
        transition:all 1s;
      }
      .font-opacity {
        transition:all 1s;
        opacity:1;
      }
    }
  }
}
</style>
