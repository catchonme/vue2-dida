import {getStore, setStore, removeStore} from '../config/utils'

export const STORAGE_KEY = 'tasks';

const defaultStorage = [{name:'default', todos : [{text:'test',done:false}]}]

export const state = {
  // folders: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
  // folders: [{name:'default', todos : []}]
  folders:[],
  todos:[]
}

export const actions = {
  getAllFolders ({commit}) {
    removeStore(STORAGE_KEY);
    var folders = getStore(STORAGE_KEY);
    if (!folders) {
      setStore(STORAGE_KEY, defaultStorage);
      // commit('setStorage', { defaultStorage });
      folders = getStore(STORAGE_KEY);
      commit('getAllFolders', { folders });
    } else {
      commit('getAllFolders', { folders });
    }
  }
}


export const getters = {
  todos: function () {
    let folder = state.folders.filter(val => val.name === 'default');
    let todos = folder[0].todos;
    return todos;
  },
  folderNames:function(){
    let folderNames = [];
    state.folders.map(function (val) {
      folderNames.push(val.name);
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
    state.todos = todos;//当前文件夹下的todos
  },

  // name 是文件夹的名称
  addTodo (state, { name, text }) {
    var tasks = getStore(STORAGE_KEY);
    var folder = state.folders.find(folder => folder.name === name);
    console.log(folder);
    if (!folder) {
      tasks[tasks.length].name = name;
      tasks[tasks.length].todos = [{text:text, done:false}];
    } else {
      folder.todos.push({text:text, done:false});
    }
  },

  deleteTodo( state, { todo } ) {
    state.todos.splice(state.todos.indexOf(todo), 1)
  },

  toggleTodo (state, { todo }) {
    todo.done = !todo.done
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
