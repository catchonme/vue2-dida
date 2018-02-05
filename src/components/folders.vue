<template>
    <div class="folders-page">
      <mu-appbar class="title">
        <mu-icon value="chevron_left" slot="left" @click="back" :size="30"/>
      </mu-appbar>
      <section class="folders-box">
        <mu-list-item v-for="(folder, index) in folderList" :title="folder | ellipsis" :key="index" @click="showOperateFolder(folder, index)">
          <mu-icon slot="left" value="inbox"/>
        </mu-list-item>
        <mu-dialog :open="showOperate" @close="showOperateFolder(false)">
          <mu-text-field :hintText="inputValue" v-model="inputValue" :underlineShow="true" @input="inputListen"/>
          <div class="icon-container">
            <mu-icon value="delete_forever" class="icon-left" color="red" @click="showDeleteTipFunc(true)"/>
            <mu-icon value="send" class="icon-right" v-show="showEditButton" @click="editFolderFunc"/>
          </div>
        </mu-dialog>
        <mu-dialog :open="showDeleteTip" title="删除清单" @close="showDeleteTipFunc(false)">
          删除后，清单中的所有任务将被永久删除
          <mu-flat-button slot="actions" primary @click="showDeleteTipFunc(false)" label="取消"/>
          <mu-flat-button slot="actions" @click="deleteFolderFunc" label="确定"/>
        </mu-dialog>
      </section>
    </div>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  export default {
    data() {
      return{
        showOperate:false,
        inputValue:'',
        folderName:'',
        folderIndex:'',
        errorText:'必填',
        showDeleteTip:false,
        showEditButton:true,
      }
    },
    computed:{
      ...mapState([
        'folders'
      ]),
      folderList:function(){
        let folders = this.folders;
        let folderList = [];
        folders.forEach(function(folder){
          folderList.push(folder.name);
        })
        return folderList;
      }
    },
    methods:{
      ...mapMutations([
        'editFolder',
        'deleteFolder'
      ]),
      showOperateFolder(val, index=null) {
        if (!val) {
          this.showOperate = false;
        } else {
          this.showOperate = true;
          this.inputValue = val;
          this.folderName = val;
          this.folderIndex = index;
        }
      },
      inputListen() {
        if (!this.inputValue) {
          this.showEditButton = false;
        } else {
          this.showEditButton = true;
        }
      },
      editFolderFunc(){
        let oldFolderName = this.folderName;
        let newFolderName = this.inputValue;
        this.editFolder({oldFolderName, newFolderName});
        this.showOperate = false;
      },
      deleteFolderFunc() {
        let folderIndex = this.folderIndex;
        this.deleteFolder({folderIndex});
        this.showDeleteTip = false;
        this.showOperate = false;
      },
      showDeleteTipFunc(val){
        val ? this.showDeleteTip = true : this.showDeleteTip = false;
      },
      back() {
        this.$router.go(-1);
      }
    },
    filters:{
      ellipsis:function(n) {
        return n.length < 10 ? n : n.substring(0,10)+'...';
      }
    }
  }
</script>

<style lang="scss" scoped>
.folders-page {
  background:#fff;
}
.icon-container {
  position: relative;
  height: 50px;
}
.icon-right {
  position: absolute;
  right:0;
}
  .icon-left {
    position: absolute;
    left:0;
  }
  .none {
    display:none;
  }
</style>
