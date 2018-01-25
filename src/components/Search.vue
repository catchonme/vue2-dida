<template>
  <div>
    <mu-appbar>
      <mu-icon-button icon="chevron_left" slot="left" @click="back"/>
    </mu-appbar>
    <form class="search-form">
      <input type="search" name="search" placeholder="请输入任务名称" class="search-input" v-model="searchValue" @input="checkInput">
      <input type="submit" name="submit" class="search-submit" @click.prevent="searchTask('')">
    </form>
    <section class="search-results">
      <ul class="todo-list">
        <!--<todo v-for="(todo, index) in filteredTodos" :key="index" :todo="todo"></todo>-->
      </ul>
    </section>
    <section class="search-history" v-if="searchHistory.length && showHistory">
      <h4 class="title-search-tasks">搜索历史</h4>
      <mu-list class="search-history-list">
        <mu-list-item v-for="(item, index) in searchHistory" :title="item" :key="index">
          <mu-icon slot="right" value="clear" @click="clearCurrentHistory(index)"/>
        </mu-list-item>
      </mu-list>
      <div class="clear-history" v-if="!searchHistory.length" @click="clearAllHistory">清空搜索历史</div>
    </section>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import { setStore, getStore } from '../config/utils'
  import { SEARCH_HISTORY_key } from '../store/mutations'
  export default {
    data() {
      return {
        searchValue:'',
        showHistory:true,
        searchResults:[]
      }
    },
    created() {
      this.$store.dispatch('getSearchHistory');
    },
    computed: {
      searchHistory(){
        return this.$store.state.searchHistory
      },
      folders() {
        return this.$store.state.folders;
      }
    },
    methods:{
      ...mapMutations([
        'addSearchHistory'
      ]),
      back() {
        this.$router.go(-1);
      },
      checkInput() {

      },
      searchTask() {
        this.searchHistory.push(this.searchValue);
        setStore(SEARCH_HISTORY_key, this.searchHistory);
        this.addSearchHistory(this.searchValue);
        let searchResults = [];
        folders.forEach(function(val){
          val.todos.forEach(function(item){
            if (item.)
          })
        })

      },
      clearCurrentHistory(index) {
        this.searchHistory.splice(index,1);
        setStore(SEARCH_HISTORY_key, this.searchHistory);
      },
      clearAllHistory() {
        this.searchHistory = [];
        setStore(SEARCH_HISTORY_key, this.searchHistory);
      }
    }

  }
</script>

<style lang="scss" scoped>
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
    color:#e4e4e4;
    font-weight:bold;
    text-align:center;
  }
  .search-history-list {
    background-color:#fff;
    margin:0 auto;
  }
}
  .search-none {
    margin:0 auto;
    color:#333;
    background-color:#fff;
    text-align:center;
    margin-top:0.125rem;
  }
</style>
