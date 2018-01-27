<template>
<div style="background: #fff">
  <mu-appbar>
    <mu-icon-button icon="chevron_left" slot="left" @click="back"/>
    <mu-icon-button icon="more_horiz" @click="openBottomSheet" slot="right"/>
  </mu-appbar>
  <section class="main">
    <!--<div class="view">
      <input class="toggle"
             type="checkbox">
             &lt;!&ndash;:checked="todo.done"&ndash;&gt;
             &lt;!&ndash;@change="toggleTask(todo)">&ndash;&gt;
      &lt;!&ndash;<label v-text="todo.text"></label>&ndash;&gt;
    </div>-->
    <form class="detail-form">
      <input class="title" type="text" placeholder="标题" >
      <div class="content" contenteditable="true">she</div>
    </form>
  </section>
</div>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    data(){
      return{

      }
    },
    mounted(){
      /*mountedTask:function(){
        let query = this.$router.query;
        console.log(query);return;
      }*/
    },
    computed:{
      /*task:function(){
        let query = this.$router.query;
        console.log(query);
        let folderName = query.folderName;
        let taskIndex = query.taskIndex;
        // let task =  this.$store.commit('getTaskDetail', { folderName , taskIndex})
        let task = this.getTaskDetail(folderName, taskIndex);
        console.log(task);
        return task;
      },*/
    },
    methods:{
      ...mapMutations([
        'getTaskDetail'
      ]),
      openBottomSheet() {

      },
      back(){
        // console.log(this.mountedTask);
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .main {
    background-color:#fff;
    /*width:100%;*/
    /*margin:0 auto;*/
  }
  .detail-form{
    display:flex;
    /*margin:0 auto;*/
    flex-direction: column;
    padding:.5rem;
    .title {
      flex:1;
      line-height:2rem;
      height:2rem;
      border-bottom:1px solid #ccc;
    }
    .content {
      flex:5;
      position: absolute;
      left:0;
      right:0;
      bottom:0;
      top:5rem;
      padding:0.8rem;
      /*width:100%;*/
      /*height:500px;*/
      background-color:#fff;
    }
  }
  .view {
    padding-left:20px;
  }
   .toggle {
    opacity: 0;
  }
   .toggle + label {
    /*
          Firefox requires `#` to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
          IE and Edge requires *everything* to be escaped to render, so we do that instead of just the `#` - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
      */
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
    background-size:30px 30px;
    background-repeat: no-repeat;
    background-position: center left;
  }

   .toggle:checked + label {
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
    background-size:30px 30px;
  }
</style>
