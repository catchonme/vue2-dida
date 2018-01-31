<template>
<div>
  <mu-appbar>
    <mu-icon-button icon="chevron_left" slot="left" @click="back"/>
    <mu-icon-button icon="more_horiz" @click="openBottomSheet" slot="right"/>
    <mu-bottom-sheet :open="bottomSheet" @close="closeBottomSheet">
      <mu-list @itemClick="chooseItem">
        <mu-list-item title="移动" value="move"/>
        <mu-list-item title="删除" value="delete"/>
      </mu-list>
    </mu-bottom-sheet>
    <mu-dialog :open="showConfirmDelete" title="提示" @close="confirmDelete(false)">
      确定删除该任务?
      <mu-flat-button slot="actions" @click="confirmDelete(false)" primary label="取消"/>
      <mu-flat-button slot="actions" primary @click="confirmDelete(true)" label="确定"/>
    </mu-dialog>
    <mu-dialog :open="showFolderList" @close="changeFolder(false)" title="移动到" scrollable>
      <form>
        <ul class="folder-list">
          <li v-for="(folder, index) in folderList" :key="index" class="folder">
            <div class="view">
              <input class="toggle"
                     type="radio"
                     :id="folder.name"
                     :checked="folder.selected"
                     name="folder"
                     @change="changeFolder(folder.name)">
              <label v-text="folder.name" :for="folder.name" @click="changeFolder(folder.name)"></label>
            </div>
          </li>
        </ul>
      </form>
      <mu-flat-button primary label="关闭" @click="changeFolder(false)" slot="actions"/>
    </mu-dialog>
  </mu-appbar>
  <section class="main">
    <form class="detail-form">
      <input class="title" type="text" placeholder="准备做什么" v-model="detail.title">
      <div class="content" id="content" contenteditable="true" v-model="detail.content">{{detail.content}}</div>
    </form>
  </section>
</div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  export default {
    data(){
      return{
        folderName:'',
        taskIndex:'',
        detail:{},
        input:'',
        bottomSheet:false,
        showConfirmDelete:false,
        showFolderList:false,
        folderName:''
      }
    },
    created(){
      let folderName = this.$route.query.folderName;
      console.log('init detail');
      console.log(folderName);
      let taskIndex = this.$route.query.taskIndex;
      this.$store.dispatch('getAllFolders',{folderName});
      this.$store.commit('getTaskDetail',{folderName, taskIndex});
      this.detail = this.$store.state.detail;
    },
    computed:mapState({
      folders:state => state.folders,
      folderList(state) {
        let folderList = [];
        let currentFolderName = this.$route.query.folderName;
        state.folders.forEach(function (folder) {
          if (folder.name == currentFolderName) {
            folderList.push({name:folder.name,selected:true})
          } else {
            folderList.push({name:folder.name,selected:false})
          }
        })
        return folderList;
      }
    }),
    methods:{
      ...mapMutations([
        'getTaskDetail',
        'editTask',
        'deleteTask',
        'moveToFolder'
      ]),
      closeBottomSheet () {
        this.bottomSheet = false
      },
      openBottomSheet () {
        this.bottomSheet = true;
      },
      confirmDelete(val) {
        if (val) {
          let folderName = this.$route.query.folderName;
          let taskIndex = this.$route.query.taskIndex;
          this.deleteTask({folderName, taskIndex});
          this.showConfirmDelete = false;
          this.$router.go(-1);
        } else {
          this.showConfirmDelete = false;
        }
      },
      chooseItem(val) {
        var selected = val.value;
        switch (selected) {
          case 'move' :
          {
            this.bottomSheet = false;
            this.showFolderList = true;
          }; break;
          case 'delete' :
          {
            this.bottomSheet = false;
            this.showConfirmDelete = true;
          }; break;
        }
      },
      changeFolder(val){
        if (!val) {
          this.showFolderList = false;
        } else {
          let newFolderName = val;
          let oldFolderName = this.$route.query.folderName;
          let oldTaskIndex = this.$route.query.taskIndex;
          let origin = this.$route.query.origin;
          this.moveToFolder({oldFolderName, oldTaskIndex, newFolderName});
          this.showFolderList = false;
          this.$router.push({name:'Detail',query:{folderName:newFolderName,taskIndex:oldTaskIndex,origin:origin}});
        }
      },
      back(){
        let content = document.getElementById("content").innerText;
        let title = this.detail.title;
        let folderName = this.$route.query.folderName;
        let taskIndex = this.$route.query.taskIndex;
        this.editTask({folderName, taskIndex, title, content});
        let origin = this.$route.query.origin;
        if (origin == 'Tasks') {
          this.$router.push({name:'Tasks',query:{folderName:folderName}});
        } else if (origin = 'Search') {
          this.$router.go(-1);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  /*.folder-list {
    background: #f5f5f5;
  },*/
  li .toggle {
    text-align: center;
    width: 20px;
    /* auto, since non-WebKit browsers doesn't support input styling */
    height: auto;
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    border: none; /* Mobile Safari */
    -webkit-appearance: none;
    appearance: none;
  }

  li .toggle {
    opacity: 0;
  }

  li .toggle + label {
    /*
          Firefox requires `#` to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
          IE and Edge requires *everything* to be escaped to render, so we do that instead of just the `#` - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
      */
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23ededed%22%20stroke-width%3D%223%22/%3E%3C/svg%3E');
    background-size:30px 30px;
    background-repeat: no-repeat;
    background-position: center left;
  }

  li .toggle:checked + label {
    background-image: url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%22-10%20-18%20100%20135%22%3E%3Ccircle%20cx%3D%2250%22%20cy%3D%2250%22%20r%3D%2250%22%20fill%3D%22none%22%20stroke%3D%22%23bddad5%22%20stroke-width%3D%223%22/%3E%3Cpath%20fill%3D%22%235dc2af%22%20d%3D%22M72%2025L42%2071%2027%2056l-4%204%2020%2020%2034-52z%22/%3E%3C/svg%3E');
    background-size:30px 30px;
  }

  li label {
    word-break: break-all;
    padding: 10px 10px 10px 50px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }

  .main {
    background-color:#fff;
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

</style>
