import {getStore, setStore, removeStore} from '../config/utils'

export const STORAGE_KEY = 'tasks';
export const SEARCH_HISTORY_KEY = 'tasks-search-history'

const defaultStorage = [
  {name:'default', todos : [{text:'开始你的任务',done:false}]},
  {name:'今天', todos : [{text:'开始你的任务',done:false}]},
  ]

export const state = {
  folders:[],
  todos:[],
  searchHistory:[]
}

export const actions = {
  getAllFolders ({commit}) {
    // removeStore(STORAGE_KEY);
    var folders = getStore(STORAGE_KEY);
    if (!folders) {
      setStore(STORAGE_KEY, defaultStorage);
      folders = getStore(STORAGE_KEY);
      commit('getAllFolders', { folders });
    } else {
      commit('getAllFolders', { folders });
    }
  },
  getSearchHistory ({ commit }) {
    var searchHistory = getStore(SEARCH_HISTORY_KEY);
    if(!searchHistory) {
      searchHistory = [];
    }
    commit('getSearchHistory',  searchHistory );
  }
}


export const getters = {
  folderNames:function(){
    let folderNames = [];
    state.folders.map(function (val) {
      let unCompletedTodoNum = 0;
      val.todos.forEach(function(todo){
        if (!todo.done) {
          unCompletedTodoNum++
        }
      })
      folderNames.push({name:val.name,todoNum:(String)(unCompletedTodoNum)});
    });
    return folderNames;
  }
}


export const mutations = {
  /*addTodo (state, { text, priority, folder, date }) {
    state.todos.push({
      text,
      priority,
      folder,
      date,
      done:false
    })
  },*/

  getAllFolders (state, { folders }) {
    state.folders = folders;
    let folder = state.folders.filter(val => val.name === 'default'); // 刚登录显式默认文件夹的todo
    let todos = folder[0].todos;
    state.todos = todos;
  },

  getCurrentFolders(state, { folders }) {
    state.folders = folders;
    let folder = state.folders.filter(val => val.name === 'default'); // 刚登录显式默认文件夹的todo
    let todos = folder[0].todos;
    state.todos = todos;
  },

  switchFolder (state, { folderName }) {
    let folder = state.folders.filter(val => val.name === folderName);
    let todos = folder[0].todos;
    state.todos = todos;
  },

  // name 是文件夹的名称
  addTodo (state, { name, text }) {
    let folders = state.folders;
    let folder = state.folders.find(folder => folder.name === name);
    if (!folder) {
      folders.push({name:name,todos:[{text:text,done:false}]});
    } else {
      folder.todos.push({text:text, done:false});
    }
    setStore(STORAGE_KEY, folders);
  },

  addFolder (state,  folder ) {
    state.folders.push({name:folder,todos:[]});
    setStore(STORAGE_KEY, state.folders);
  },

  getSearchHistory(state, searchHistory) {
    state.searchHistory = searchHistory;
  },

  addSearchHistory(state, search) {
    state.searchHistory.unshift(search);
    setStore(SEARCH_HISTORY_KEY, state.searchHistory);
  },

  deleteSearchHistory(state, index) {
    state.searchHistory.splice(index, 1);
    setStore(SEARCH_HISTORY_KEY, state.searchHistory);
  },

  clearSearchHistory(state) {
    state.searchHistory = [];
    setStore(SEARCH_HISTORY_KEY, state.searchHistory);
  },

  toggleTask(state, item) {
    console.log('------传值')
    console.log(item);
    let folders = state.folders;
    folders.forEach(function(folder){
      if (folder.name == item.folderName) {
        console.log(folder.todos[item.taskIndex]);
        folder.todos[item.taskIndex].done = !folder.todos[item.taskIndex].done;
      }
    })
    state.folders = folders;
    setStore(STORAGE_KEY, folders);
    console.log('---结果')
    console.log(state.folders);
  },

  deleteTodo( state, { todo } ) {
    state.todos.splice(state.todos.indexOf(todo), 1)
    setStore(STORAGE_KEY, state.folders);
  },

  toggleTodo (state, { todo }) {
    todo.done = !todo.done;
    setStore(STORAGE_KEY, state.folders);
  },

  editTodo (state, { todo, text, priority, folder, date  }) {
    todo.text = text;
    todo.priority = priority;
    todo.folder = folder;
    todo.date = date;
  },

  toggleAll (state, { done }) {
    state.todos.forEach((todo) => {
      todo.done = done;
    })
  },

  clearCompleted ( state ) {
    state.todos = state.todos.filter(todo => !todo.done)
  },

  clearAllTodo (state) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
