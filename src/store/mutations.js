import {getStore, setStore, removeStore} from '../config/utils'

// 需要合并所有的存储，为一个，这样就不需要这么多的键值了
export const STORAGE_KEY = 'tasks';
export const SEARCH_HISTORY_KEY = 'tasks-search-history'
export const CONFIG_KEY = 'tasks-config'
export const USER_KEY = 'tasks-user'

// 增加日期后，可能还需要增加日期是否过期的键值，这样才好判断，哪些已经过期了，还是直接根据时间对比？
const defaultStorage = [
  {name:'default', tasks : [{title:'开始你的任务',content:'',done:false,priority:0,date:''}]},
  {name:'今天', tasks : [{title:'开始你的任务',content:'',done:false,priority:0,date:''}]},
  ]
const defaultConfig = {showCompleted:false}
const defaultUser = {username:'',password:'',phone:''}

// 这些 state 是否也需要合并成一个？还是把整个 mutation 分开成多个
export const state = {
  config:[],
  folders:[],
  tasks:[],
  searchHistory:[],
  detail:{},
  user:{}
}

export const actions = {
  getAllFolders ({commit},{folderName}) {
    // removeStore(STORAGE_KEY);
    // setStore(USER_KEY, defaultUser);
    let folders = getStore(STORAGE_KEY);
    let config = getStore(CONFIG_KEY);
    let user = getStore(USER_KEY);
    if (!folders) {
      setStore(STORAGE_KEY, defaultStorage);
      folders = getStore(STORAGE_KEY);
    }
    if (!config) {
      setStore(CONFIG_KEY, defaultConfig);
      config = getStore(CONFIG_KEY);
    }
    if (!user) {
      setStore(USER_KEY, defaultUser);
      user = getStore(USER_KEY);
    }
    commit('getAllFolders', { folders, config, user, folderName});
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
  getAllFolders (state, { folders, config, user, folderName}) {
    // let name = folderName || 'default';
    state.folders = folders;
    let folder = state.folders.find(folder => folder.name == folderName);
    let tasks = folder.tasks;
    let stateTasks = [];
    tasks.forEach(function(task, index){
      stateTasks.push({taskIndex:index, title:task.title, done:task.done, folderName:folder.name})
    })
    state.tasks = stateTasks;
    state.config = config;
    state.user = user;
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
  addTask (state, {folderName, title}) {
    /*let folderName = data.folderName;
    let title = data.title;*/
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

  deleteTask( state, { folderName, taskIndex } ) {
    let folders = state.folders;
    folders.forEach(function(folder){
      if (folder.name == folderName) {
        folder.tasks.splice(taskIndex, 1);
      }
    })
    state.folders = folders;
    setStore(STORAGE_KEY, state.folders);
  },

  editTask (state, { folderName, taskIndex, title, content  }) {
    console.log('edit task');
    console.log(title);
    let folders = state.folders;
    console.log(folders);
    folders.forEach(function(folder) {
      console.log(folder);
      if (folder.name == folderName) {
        folder.tasks[taskIndex].title = title;
        folder.tasks[taskIndex].content = content;
      }
    });
    state.folders = folders;
    setStore(STORAGE_KEY, state.folders);
  },

  moveToFolder(state, {oldFolderName, oldTaskIndex, newFolderName}) {
    let folders = state.folders;
    let task = {};
    folders.forEach(function(folder) {
      if (folder.name == oldFolderName) {
        task = folder.tasks[oldTaskIndex];
        folder.tasks.splice(oldTaskIndex, 1);
      }
    });
    folders.forEach(function(folder) {
      if (folder.name == newFolderName) {
        folder.tasks.push(task);
      }
    })
    state.folders = folders;
    console.log('move folder');
    console.log(state.folders);
    setStore(STORAGE_KEY, state.folders);
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
  },

  login(state, {username, password}) {
    state.user.username = username;
    state.user.password = password;
    setStore(USER_KEY,state.user);
  },

  loginOut(state) {
    state.user = {};
    setStore(USER_KEY, state.user);
  },

  changeUsername(state, { username }) {
    let user = state.user;
    user.username = username;
    state.user = user;
    setStore(USER_KEY, state.user);
  },

  // 密码还是要加密
  changePassword(state, { password }) {
    let user = state.user;
    user.password = password;
    state.user = user;
    setStore(USER_KEY, state.user);
  },

  editFolder(state, { oldFolderName, newFolderName }) {
    let folders = state.folders;
    folders.forEach(function(folder) {
      if (folder.name == oldFolderName) {
        folder.name = newFolderName;
      }
    })
    state.folders = folders;
    setStore(STORAGE_KEY, state.folders);
  },

  deleteFolder( state, { folderIndex }) {
    let folders = state.folders;
    folders.forEach(function(folder, index) {
      if (index == folderIndex) {
        folders.splice(folderIndex, 1);
      }
    })
    state.folders = folders;
    setStore(STORAGE_KEY, state.folders);
  }
}
