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
      <ul class="todo-list" v-if="searchResults.length">
        <todo v-for="(item, index) in searchResults" :key="index" :todo="item" :folderName="item.forderName"></todo>
      </ul>
      <div class="search-none" v-else>很抱歉，无搜索结果</div>
    </section>
    <section class="search-history" v-if="searchHistory.length && showHistory">
      <h4 class="title-search-tasks">搜索历史</h4>
      <mu-list class="search-history-list">
        <mu-list-item v-for="(item, index) in searchHistory" :title="item" :key="index" @click="searchFromHistory(item)">
          <mu-icon slot="right" value="clear" @click="deleteSearchHistory(index)"/>
        </mu-list-item>
      </mu-list>
      <mu-divider/>
      <div class="clear-history" @click="clearSearchHistory">清空搜索历史</div>
    </section>
  </div>
</template>

<script>
  import Todo from './Todo'
  import { mapMutations } from 'vuex';

  export default {
    components: { Todo },
    data() {
      return {
        searchValue:'',
        showHistory:true,
        searchResults:[],
        list:[]
      }
    },
    created() {
      this.$store.dispatch('getSearchHistory');
      this.$store.dispatch('getAllFolders');
    },
    computed: {
      searchHistory(){
        return this.$store.state.searchHistory
      },
      folders() {
        return this.$store.state.folders;
      }
    },
    watch:{
      list:function(){
        console.log(this.list)
      }
    },
    methods:{
      ...mapMutations([
        'addSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory',
        'toggleTask'
      ]),
      detaill() {
        console.log('detail');
      },
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
        this.folders.forEach(function(val){
          val.todos.forEach(function(item, itemIndex){
            if (item.text.indexOf(search) > -1) {
              results.push({taskIndex:(String)(itemIndex), text:item.text, done:item.done, folderName:val.name} );
            }
          })
        })
        this.searchResults = results;
        console.log(this.searchResults);
      },
      searchFromHistory(val) {
        this.searchValue = val;
        this.searchTask();
      },
      /*deleteSearchHistory(index) {
        // this.searchHistory.splice(index,1);
        this.deleteSearchHistory(index);
        let temp = getStore(SEARCH_HISTORY_KEY);
        console.log(temp);
      },
      clearAllHistory() {
        this.clearAllHistory();
        removeStore(SEARCH_HISTORY_KEY);
      }*/
    }

  }
</script>

<style lang="scss" scoped>
  .todo-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .todo-list li {
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
      height:3em;
      line-height:3em;
      .task-title {
        margin-left:20px;
        margin-top:-20px;
      }
    }
  }
}
</style>
