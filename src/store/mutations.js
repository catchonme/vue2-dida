export const STORAGE_KEY = 'dida'

export const state = {
  todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
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

  addTodo (state, { text }) {
    state.todos.push({
      text,
      done:false
    })
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
