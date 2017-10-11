<template>
<div>
  <table class="table">
    <thead>
      <tr>
        <th>Project Name</th>
        <th>Assigned To</th>
        <th>Priority</th>
        <th>Completed</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in projects">
        <td>{{item.name}}</td>
        <td>{{item.assignedTo}}</td>
        <td>{{item.priority}}</td>
        <td><complete-toggle :item="item" /></td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script>
import { mapState } from 'vuex'
import completeToggle from './completeToggle'

export default {
  name: 'projectList',
  computed: mapState([
    'projects'
  ]),
  components: {
    completeToggle
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
