<template>
  <li class="task" :class="{ completed: task.done }">
    <div class="view">
      <input class="toggle"
             type="checkbox"
             :checked="task.done"
             @change="toggleTask(task)">
      <label @click="detail(task)">{{ task.title | ellipsis}}</label>
    </div>
  </li>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
    name: "task",
    props:['task', 'folderName'],
    methods:{
      ...mapMutations([
        'toggleTask'
      ]),
      detail(task) {
        let origin = this.$router.history.current.name;
        this.$router.push({name:'detail', query:{folderName:task.folderName,taskIndex:task.taskIndex,origin:origin}})
      }
    },
    filters: {
      ellipsis: function (n) {
        return n.length < 10 ? n : n.substring(0,10)+'...'
      }
    },
  }
</script>

<style scoped>
  li .view {
    padding-left:20px;
  }
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
    /*
          Firefox requires `#` to be escaped - https://bugzilla.mozilla.org/show_bug.cgi?id=922433
          IE and Edge requires *everything* to be escaped to render, so we do that instead of just the `#` - https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/7157459/
      */
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
</style>
