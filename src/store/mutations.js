import {getStore, setStore, removeStore} from '../config/utils'

export const STORAGE_KEY = 'tasks';
export const SEARCH_HISTORY_KEY = 'tasks-search-history'
export const CONFIG_KEY = 'tasks-config'

const defaultStorage = [
  {name:'default', tasks : [{title:'开始你的任务',content:'',done:false,priority:0,date:''}]},
  {name:'今天', tasks : [{title:'开始你的任务',content:'',done:false,priority:0,date:''}]},
  ]

const defaultConfig = {showCompleted:false}

export const state = {
  config:[],
  folders:[],
  tasks:[],
  searchHistory:[],
  detail:{}
}

export const actions = {
  getAllFolders ({commit}) {
    // removeStore(STORAGE_KEY);
    var folders = getStore(STORAGE_KEY);
    var config = getStore(CONFIG_KEY);
    if (!folders) {
      setStore(STORAGE_KEY, defaultStorage);
      setStore(CONFIG_KEY, defaultConfig);
      folders = getStore(STORAGE_KEY);
      config = getStore(CONFIG_KEY);
    }
    commit('getAllFolders', { folders, config});
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
    state.folders.map(function (folder) {
      let unCompletedTaskNum = 0;
      folder.tasks.forEach(function(task){
        if (!task.done) {
          unCompletedTaskNum++
        }
      })
      folderNames.push({name:folder.name,taskNum:(String)(unCompletedTaskNum)});
    });
    return folderNames;
  }
}

export const mutations = {
  getAllFolders (state, { folders, config}) {
    state.folders = folders;
    let folder = state.folders.find(folder => folder.name === 'default'); // 刚登录显式默认文件夹的任务
    let tasks = folder.tasks;
    let stateTasks = [];
    tasks.forEach(function(task, index){
      stateTasks.push({taskIndex:index, title:task.title, done:task.done, folderName:folder.name})
    })
    state.tasks = stateTasks;
    state.config = config;
  },

  getCurrentFolder(state, { folders }) {
    state.folders = folders;
    let folder = state.folders.find(folder => folder.name === 'default'); // 刚登录显式默认文件夹的任务
    let tasks = folder.tasks;
    state.tasks = tasks;
  },

  getTaskDetail(state, {folderName, taskIndex}) {
    let folders = state.folders;
    let detail = {};
    folders.forEach(function(folder) {
      if (folder.name == folderName) {
        let task = folder.tasks[taskIndex];
        detail = {taskIndex:taskIndex, title:task.title, content:task.content, done:task.done,date:task.date, folderName:folderName}
      }
    })
    state.detail = detail;
  },

  switchFolder (state, { folderName }) {
    let folder = state.folders.find(folder => folder.name === folderName);
    let tasks = folder.tasks;
    let stateTasks = [];
    tasks.forEach(function(task, index){
      stateTasks.push({taskIndex:index, title:task.title, done:task.done, folderName:folder.name})
    })
    state.tasks = stateTasks;
  },

  // name 是文件夹的名称
  addTask (state, data) {
    let folderName = data.folderName;
    let title = data.title;
    let folders = state.folders;
    let folder = state.folders.find(folder => folder.name === folderName);
    if (!folder) {
      folders.push({name:name, tasks : [{title:title,content:'',done:false,priority:0,date:''}]});
    } else {
      folder.tasks.push({title:title,content:'',done:false,priority:0,date:''});
    }
    let tasks = folder.tasks;
    let stateTasks = [];
    tasks.forEach(function(task, index){
      stateTasks.push({taskIndex:index, title:task.title, done:task.done, folderName:folder.name})
    })
    state.tasks = stateTasks;
    setStore(STORAGE_KEY, folders);
  },

  addFolder (state,  folder ) {
    state.folders.push({name:folder,tasks:[]});
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
    let folders = state.folders;
    folders.forEach(function(folder){
      if (folder.name == item.folderName) {
        folder.tasks[item.taskIndex].done = !folder.tasks[item.taskIndex].done;
      }
    })
    state.folders = folders;
    let folder = state.folders.find(folder => folder.name === item.folderName);
    let tasks = folder.tasks;
    let stateTasks = [];
    tasks.forEach(function(task, index){
      stateTasks.push({taskIndex:index, title:task.title, done:task.done, folderName:folder.name})
    })
    state.tasks = stateTasks;
    setStore(STORAGE_KEY, folders);
  },

  deleteTask( state, { task } ) {
    state.tasks.splice(state.tasks.indexOf(task), 1)
    // setStore(STORAGE_KEY, state.folders);
  },

  editTask (state, { folderName, taskIndex, title, content  }) {
    let folders = state.folders;
    folders.forEach(function(folder) {
      if (folder.name == folderName) {
        folder.tasks[taskIndex].title = title;
        folder.tasks[taskIndex].content = content;
      }
    });
    setStore(STORAGE_KEY, folders);
  },

  toggleAll (state, { done }) {
    state.tasks.forEach((task) => {
      task.done = done;
    })
  },

  clearCompleted ( state ) {
    state.tasks = state.tasks.filter(task => !task.done)
  },

  clearAllTasks (state) {
    window.localStorage.removeItem(STORAGE_KEY);
  },

  saveConfig(state, options) {
    state.config[options.name] = options.value;
    setStore(CONFIG_KEY, state.config);
  }
}
