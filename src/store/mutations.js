import {getStore, setStore, removeStore} from '../config/utils'

export const STORAGE_KEY = 'vue2-dida';
// 默认存储数据
const defaultStorage = {
  folders:[
    {name:'默认', tasks : [{title:'开始你的任务',content:'',done:false,priority:0,date:''}]},
    {name:'收集箱', tasks : [{title:'开始你的任务',content:'',done:false,priority:0,date:''}]}
  ],
  searchHistory:[],
  config:{showCompleted:false},
  user:{username:'',password:'',phone:''}
}

export const state = {
  folders:[],
  searchHistory:[],
  config:[],
  user:{},
  tasks:[],
  detail:{}
}
// 初始化数据
export const actions = {
  initData ({commit},{folderName}) {
    // removeStore(STORAGE_KEY);
    let storage = getStore(STORAGE_KEY);
    if (!storage) {
      setStore(STORAGE_KEY, defaultStorage);
      storage = getStore(STORAGE_KEY);
    }
    commit('initData', { storage, folderName});
  }
}
// 获取所有的清单名称和清单下的任务数，在左侧栏显示
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
      folderNames.push({name:folder.name,taskNum:String(unCompletedTaskNum)});
    });
    return folderNames;
  }
}

export const mutations = {
  // 初始化数据
  initData (state, { storage, folderName}) {
    state.folders = storage.folders;
    let folder = state.folders.find(folder => folder.name == folderName);
    let tasks = folder.tasks;
    let stateTasks = [];
    tasks.forEach(function(task, index){
      stateTasks.push({taskIndex:index, title:task.title, done:task.done, date:task.date, priority:task.priority, folderName:folder.name})
    })
    state.tasks = stateTasks;
    state.config = storage.config;
    state.user = storage.user;
    state.searchHistory = storage.searchHistory;
  },

  // 获取该任务的详情
  getTaskDetail(state, {folderName, taskIndex}) {
    let folders = state.folders;
    let detail = {};
    console.log(folders);
    folders.forEach(function(folder) {
      if (folder.name == folderName) {
        let task = folder.tasks[taskIndex];
        detail = {taskIndex:taskIndex, title:task.title, content:task.content, done:task.done,date:task.date, priority:task.priority, folderName:folderName}
      }
    })
    state.detail = detail;
  },

  // 主页面左侧栏点击文件夹切换
  switchFolder (state, { folderName }) {
    let folder = state.folders.find(folder => folder.name === folderName);
    let tasks = folder.tasks;
    let stateTasks = [];
    tasks.forEach(function(task, index){
      stateTasks.push({taskIndex:index, title:task.title, done:task.done, folderName:folder.name})
    })
    state.tasks = stateTasks;
  },

  // 添加任务
  addTask (state, {folderName, title, date, priority}) {
    let folders = state.folders;
    let folder = folders.find(folder => folder.name == folderName);
    folder.tasks.push({title:title,content:'',done:false,priority:priority,date:date});
    let stateTasks = [];
    folder.tasks.forEach(function(task, index){
      stateTasks.push({taskIndex:index, title:task.title, done:task.done, date:task.date, folderName:folder.name})
    })
    state.tasks = stateTasks;
    state.folders = folders;
    let storage = getStore(STORAGE_KEY);
    storage.folders = state.folders;
    setStore(STORAGE_KEY, storage);
  },

  // 添加清单
  addFolder (state, folder ) {
    state.folders.push({name:folder,tasks:[]});
    let storage = getStore(STORAGE_KEY);
    storage.folders = state.folders;
    setStore(STORAGE_KEY, storage);
  },

  // 存储搜索记录
  addSearchHistory(state, search) {
    state.searchHistory.unshift(search);
    let storage = getStore(STORAGE_KEY);
    storage.searchHistory = state.searchHistory;
    setStore(STORAGE_KEY, storage);
  },

  // 删除搜索记录
  deleteSearchHistory(state, index) {
    let searchHistory = state.searchHistory;
    searchHistory.splice(index, 1);
    state.searchHistory = searchHistory;
    let storage = getStore(STORAGE_KEY);
    storage.searchHistory = state.searchHistory;
    setStore(STORAGE_KEY, storage);
  },

  // 清除所有的搜索搜索记录
  clearSearchHistory(state) {
    state.searchHistory = [];
    let storage = getStore(STORAGE_KEY);
    storage.searchHistory = state.searchHistory;
    setStore(STORAGE_KEY, storage);
  },

  // 点击是否完成当前任务
  toggleTask(state, item) {
    let folders = state.folders;
    folders.forEach(function(folder){
      if (folder.name == item.folderName) {
        folder.tasks[item.taskIndex].done = !folder.tasks[item.taskIndex].done;
      }
    })
    let folder = folders.find(folder => folder.name === item.folderName);
    let tasks = folder.tasks;
    let stateTasks = [];
    tasks.forEach(function(task, index){
      stateTasks.push({taskIndex:index, title:task.title, done:task.done, folderName:folder.name})
    })
    state.folders = folders;
    state.tasks = stateTasks;
    let storage = getStore(STORAGE_KEY);
    storage.folders = state.folders;
    setStore(STORAGE_KEY, storage);
  },

  // 删除当前任务
  deleteTask( state, { folderName, taskIndex } ) {
    let folders = state.folders;
    folders.forEach(function(folder){
      if (folder.name == folderName) {
        folder.tasks.splice(taskIndex, 1);
      }
    })
    state.folders = folders;
    let storage = getStore(STORAGE_KEY);
    storage.folders = state.folders;
    setStore(STORAGE_KEY, storage);
  },

  // 在详情内编辑当前任务
  editTask (state, { folderName, taskIndex, title, content, done, date, priority }) {
    let folders = state.folders;
    folders.forEach(function(folder) {
      if (folder.name == folderName) {
        folder.tasks[taskIndex].title = title;
        folder.tasks[taskIndex].content = content;
        folder.tasks[taskIndex].done = done;
        folder.tasks[taskIndex].date = date;
        folder.tasks[taskIndex].priority = priority;
      }
    });
    state.folders = folders;
    let storage = getStore(STORAGE_KEY);
    storage.folders = state.folders;
    setStore(STORAGE_KEY, storage);
  },

  // 详情内，移动当前任务到其它清单
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
    let storage = getStore(STORAGE_KEY);
    storage.folders = state.folders;
    setStore(STORAGE_KEY, storage);
  },

  // 清除所有的任务
  clearAllTasks (state) {
    window.localStorage.removeItem(STORAGE_KEY);
  },

  // 存储配置
  saveConfig(state, options) {
    state.config[options.name] = options.value;
    let storage = getStore(STORAGE_KEY);
    storage.config = state.config;
    setStore(STORAGE_KEY, storage);
  },

  // 登录
  login(state, {username, password}) {
    state.user.username = username;
    state.user.password = password;
    let storage = getStore(STORAGE_KEY);
    storage.user = state.user;
    setStore(STORAGE_KEY, storage);
  },

  // 退出登录
  loginOut(state) {
    state.user = {};
    let storage = getStore(STORAGE_KEY);
    storage.user = state.user;
    setStore(STORAGE_KEY, storage);
  },

  // 修改用户名
  changeUsername(state, { username }) {
    let user = state.user;
    user.username = username;
    state.user = user;
    let storage = getStore(STORAGE_KEY);
    storage.user = state.user;
    setStore(STORAGE_KEY, storage);
  },

  // 修改登录密码
  changePassword(state, { password }) {
    let user = state.user;
    user.password = password;
    state.user = user;
    let storage = getStore(STORAGE_KEY);
    storage.user = state.user;
    setStore(STORAGE_KEY, storage);
  },

  // 编辑清单
  editFolder(state, { oldFolderName, newFolderName }) {
    let folders = state.folders;
    folders.forEach(function(folder) {
      if (folder.name == oldFolderName) {
        folder.name = newFolderName;
      }
    })
    state.folders = folders;
    let storage = getStore(STORAGE_KEY);
    storage.folders = state.folders;
    setStore(STORAGE_KEY, storage);
  },

  // 删除清单
  deleteFolder( state, { folderIndex }) {
    let folders = state.folders;
    folders.forEach(function(folder, index) {
      if (index == folderIndex) {
        folders.splice(folderIndex, 1);
      }
    })
    state.folders = folders;
    let storage = getStore(STORAGE_KEY);
    storage.folders = state.folders;
    setStore(STORAGE_KEY, storage);
  }
}
