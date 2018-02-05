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
      <mu-flat-button primary label="取消" @click="changeFolder(false)" slot="actions"/>
    </mu-dialog>
  </mu-appbar>
  <section class="main">
    <form class="detail-form">
      <div class="form-top">
        <mu-checkbox class="checkbox" v-model="detailChecked"/>
        <mu-date-picker :hintText="hintDate" class="date" v-model="detailDate" :underlineShow="false"/>
        <mu-time-picker :hintText="hintTime" format="24hr" v-model="detailTime" class="time" :underlineShow="false"/>
        <div class="priority">
          <mu-icon v-show="priority > 0" v-for="(item, index) in priority" :key="index+4" class="choose-priority" value="priority_high" :color="priorityColor" @click="openChoosePriority(true)"/>
          <mu-icon v-show="priority == 0" v-for="(item, index) in [1,2,3]" :key="index" class="priority-high" value="priority_high" color="gray" @click="openChoosePriority(true)"/>
        </div>
      </div>
      <input class="title" id="title" type="text" placeholder="准备做什么" v-model="detailTitle">
      <div class="content" id="content" contenteditable="true" v-model="detailContent">{{detailContent}}</div>
    </form>
    <mu-dialog class="choose-priority-box" :open="showChoosePriority" title="选择优先级" @close="openChoosePriority(false)">
      <ul class="priority-list">
        <li class="priority-item" @click="choosePriority(0)">
          <mu-radio class="priority-radio" name="priority" nativeValue="3"/>
          <mu-icon class="priority-icon" value="priority_high" color="red"/>
          <mu-icon class="priority-icon" value="priority_high" color="red"/>
          <mu-icon class="priority-icon" value="priority_high" color="red"/>
          <span class="priority-span">高</span>
        </li>
        <li class="priority-item" @click="choosePriority(1)">
          <mu-radio class="priority-radio" name="priority" nativeValue="2" />
          <mu-icon class="priority-icon" value="priority_high" color="orange"/>
          <mu-icon class="priority-icon" value="priority_high" color="orange"/>
          <span class="priority-span">中</span>
        </li>
        <li class="priority-item" @click="choosePriority(2)">
          <mu-radio class="priority-radio" name="priority" nativeValue="1" />
          <mu-icon class="priority-icon" value="priority_high"  color="blue"/>
          <span class="priority-span">低</span>
        </li>
        <li class="priority-item" @click="choosePriority(3)">
          <mu-radio class="priority-radio" name="priority" nativeValue="0" />
          <mu-icon class="priority-icon" value="priority_high" color="gray"/>
          <mu-icon class="priority-icon" value="priority_high" color="gray"/>
          <mu-icon class="priority-icon" value="priority_high" color="gray"/>
          <span class="priority-span">无</span>
        </li>
      </ul>
      <mu-flat-button slot="actions" @click="openChoosePriority(false)" primary label="取消"/>
      <mu-flat-button slot="actions" @click="openChoosePriority(false)" primary label="确定"/>
    </mu-dialog>
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
        detailTitle:'',
        detailContent:'',
        detailChecked:true,
        hintDate:'设置日期',
        hintTime:'设置时间',
        detailDate:'',
        detailTime:'',
        input:'',
        bottomSheet:false,
        showConfirmDelete:false,
        showFolderList:false,
        folderName:'',
        showChoosePriority:false,
        priority:0,
        priorityColor:"gray",
      }
    },
    created(){
      let folderName = this.$route.query.folderName;
      let taskIndex = this.$route.query.taskIndex;
      this.$store.dispatch('initData',{folderName});
      this.$store.commit('getTaskDetail',{folderName, taskIndex});
      this.detailTitle = this.$store.state.detail.title;
      this.detailContent = this.$store.state.detail.content;
      this.detailChecked = this.$store.state.detail.done;
      this.priority = this.$store.state.detail.priority;
      switch (this.priority) {
        case 0 : this.priorityColor = 'gray'; break;
        case 1 : this.priorityColor = 'blue'; break;
        case 2 : this.priorityColor = 'orange'; break;
        case 3 : this.priorityColor = 'red'; break;
      }
      let datetime = this.$store.state.detail.date;
      if (datetime) {
        let dateArr = new Date(datetime).toLocaleDateString().split('/');
        let timeArr = new Date(datetime).toTimeString().split(':');
        let date = dateArr.map(function(val) {
          if (val < 10) {
             return '0' + val;
          } else {
            return val;
          }
        }).join('-');
        let time = timeArr[0]+':'+timeArr[1];
        this.detailDate = date;
        this.hintDate = date;
        this.detailTime = time;
        this.hintTime = time;
      }
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
      openChoosePriority(bool) {
        bool ? this.showChoosePriority = true : this.showChoosePriority = false;
      },
      choosePriority(num) {
        let priorityRadio = document.querySelectorAll('.priority-radio input');
        switch(num) {
          case 0 :
          {
            priorityRadio[0].checked = true;
            this.priority = 3;
            this.priorityColor = 'red';
          }break;
          case 1:
          {
            priorityRadio[1].checked = true;
            this.priority = 2;
            this.priorityColor = 'orange';
          }break;
          case 2:
          {
            priorityRadio[2].checked = true;
            this.priority = 1;
            this.priorityColor = 'blue';
          }break;
          case 3:
          {
            priorityRadio[3].checked = true;
            this.priority = 0;
            this.priorityColor = 'gray';
          }break;
        }
      },
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
          let folders = this.folders;
          let newTaskIndex = 0;
          folders.forEach(function(folder) {
            if (folder.name == newFolderName) {
              newTaskIndex = folder.tasks.length - 1;
            }
          })
          this.showFolderList = false;
          this.$router.push({name:'detail',query:{folderName:newFolderName,taskIndex:newTaskIndex,origin:origin}});
        }
      },
      back(){
        let content = document.getElementById("content").innerText;
        let title = this.detailTitle;
        let folderName = this.$route.query.folderName;
        let taskIndex = this.$route.query.taskIndex;
        let done = this.detailChecked;
        let priority = this.priority;

        let detailDate = this.detailDate;
        let detailTime = this.detailTime;
        if(!detailDate && detailTime) {
          let dateArr = new Date().toLocaleDateString().split('/');
          detailDate = dateArr.map(function(val) {
            if (val < 10) {
              return '0' + val;
            } else {
              return val;
            }
          }).join('-');
        }
        let fullDate = detailDate + ' ' + detailTime
        if (fullDate) {
          var date = Date.parse(fullDate);
        } else {
          var date = '';
        }
        this.editTask({folderName, taskIndex, title, content, done, date, priority});
        let origin = this.$route.query.origin;
        if (origin == 'tasks') {
          this.$router.push({name:'tasks',query:{folderName:folderName}});
        } else {
          this.$router.go(-1);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
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
    flex-direction: column;
    padding:.5rem;
    .form-top{
      flex:1;
      height:1.5rem;
      position: relative;
      border-bottom:1px solid #ccc;
    }
    .title {
      flex:1;
      line-height:2rem;
      height:2rem;
      position: relative;
      border-bottom:1px solid #ccc;
    }
    .content {
      flex:5;
      position: absolute;
      left:0;
      right:0;
      bottom:0;
      top:6.5rem;
      padding:0.8rem;
      background-color:#fff;
    }
  }
  .view {
    padding-left:20px;
  }
  .priority-list {
    margin-left:-1rem;
  }
  .priority-item {
    height:1.5rem;
    line-height:1.5rem;
  }
  .priority-radio {
    float: left;
    position: relative;
    top:-0.35rem;
  }
  .priority-icon {
    margin:0 -0.8rem 0 0;
  }
  .priority-span {
    margin-left:.8rem;
    position: relative;
    top:-.2rem;
  }
  .checkbox {
    position: absolute;
  }
  .date {
    position: absolute;
    left:1.3rem;
    top:-.4rem;
    width:4.2rem;
    overflow: hidden;
  }
  .time {
    position: absolute;
    left:5rem;
    top:-.4rem;
    width:3rem;
    margin-left:.5rem;
    overflow: hidden;
  }
  .priority {
    position: absolute;
    right:1rem;
  }
  .priority-high {
    margin:0 -0.7rem 0 0;
  }
  .choose-priority {
    margin:0 -0.7rem 0 0;
  }
  .choose-priority-box:before {
    display:block;
    content:',';
    overflow: hidden;
    clear: both;
  }
</style>
