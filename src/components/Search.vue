<template>
  <div>
    <mu-appbar>
      <mu-icon-button icon="chevron_left" slot="left" @click="back"/>
    </mu-appbar>
    <form class="search-form">
      <input type="search" name="search" placeholder="请输入任务名称" class="search-input" v-model="searchValue" @input="checkInput">
      <input type="submit" name="submit" class="search-submit" @click.prevent="searchTask('')">
    </form>
    <section class="search-results" v-if="!showHistory">
      <ul class="task-list" v-if="searchResults.length">
        <task v-for="(item, index) in searchResults" :key="index" :task="item" :folderName="item.forderName"></task>
      </ul>
      <div class="search-none" v-else>很抱歉，无搜索结果</div>
    </section>
    <section class="search-history" v-if="searchHistory.length && showHistory">
      <h4 class="title-search-tasks">搜索历史</h4>
      <mu-list class="search-history-list">
        <mu-list-item v-for="(item, index) in searchHistory" :title="item" :key="index" @click="searchFromHistory(item)">
          <mu-icon slot="right" value="clear" @click.stop.prevent="deleteSearchHistory(index)"/>
        </mu-list-item>
      </mu-list>
      <mu-divider/>
      <div class="clear-history" @click="clearSearchHistory">清空搜索历史</div>
    </section>
    <footer-guider bottom-nav="search"></footer-guider>
  </div>
</template>

<script>
  import task from './task'
  import { mapState, mapMutations } from 'vuex';
  import footerGuider from './footerGuide'
  export default {
    components: { task, footerGuider },
    data() {
      return {
        searchValue:'',
        showHistory:true,
        searchResults:[],
        list:[]
      }
    },
    computed: {
      ...mapState([
        'searchHistory',
        'folders'
      ]),
    },
    methods:{
      ...mapMutations([
        'addSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory',
        'toggleTask'
      ]),
      check(item){
        console.log(item);
      },
      back() {
        this.$router.go(-1);
      },
      checkInput() {
        if (this.searchValue == '') {
          this.showHistory = true;
        }
      },
      searchTask() {
        this.showHistory = false;
        if (this.searchHistory.indexOf(this.searchValue) === -1) {
          this.addSearchHistory(this.searchValue);
        }
        let search = this.searchValue;
        let results = []
        this.folders.forEach(function(folder){
          folder.tasks.forEach(function(task, index){
            if (task.title.indexOf(search) > -1) {
              results.push({taskIndex:(String)(index), title:task.title, done:task.done, folderName:folder.name} );
            }
          })
        })
        this.searchResults = results;
      },
      searchFromHistory(val) {
        this.searchValue = val;
        this.searchTask();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .task-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .task-list li {
    position: relative;
    font-size: 24px;
    border-bottom: 1px solid #ededed;
  }
.search-form {
  background-color:#fff;
  padding:.5rem;
  display:flex;
  input{
    height:1.5rem;
  }
  .search-input {
    flex:4;
    border:0.025rem solid #e4e4e4;
    font-size:0.65rem;
    color:#333;
    border-radius:0.125rem;
    background-color:#f2f2f2;
    font-weight:bold;
    padding:0 0.25rem;
  }
  .search-submit {
    flex:1;
    border:0.025rem solid #3190e8;
    margin-left:.2rem;
    font-size:0.65rem;
    color:#fff;
    border-radius:0.125rem;
    background-color:#3190e8;
    font-weight:bold;
    padding:0 0.25rem;
  }
}
.title-search-tasks {
  font-size:.6rem;
  line-height:2rem;
  text-indent:.5rem;
  font-weight:bold;
  color:#666;
}
.search-history {
  .clear-history {
    background-color:#fff;
    color:#3190e8;
    height:1.5rem;
    line-height:1.5rem;
    font-size:1em;
    font-weight:bold;
    text-align:center;
  }
  .search-history-list {
    background-color:#fff;
    margin:0 auto;
  }
}
.search-results {
  position: relative;
  background-color:#fff;
  margin-top:.2rem;
  .search-none {
    margin:0 auto;
    color:#333;
    background-color:#fff;
    text-align:center;
    margin-top:0.125rem;
  }
  .task-list {
    width:80%;
    li {
      /*margin-left:100px;*/
      margin:0 auto;
      /*height:3em;
      line-height:3em;*/
      .task-title {
        margin-left:20px;
        margin-top:-20px;
      }
    }
  }
}
</style>
