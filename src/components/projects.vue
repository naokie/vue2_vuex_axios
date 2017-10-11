<template>
<div id="projects">
  <div class="columns">
    <div class="column is-half">
      <div class="notification">
        Project List:
      </div>
      <project-list />
      <add-project />
      <project-status />
    </div>
  </div>
</div>
</template>

<script>
import projectList from './projectList'
import addProject from './addProject'
import projectStatus from './projectStatus'

export default {
  name: 'projects',
  components: {
    projectList,
    addProject,
    projectStatus
  },
  mounted () {
    this.$store.dispatch('LOAD_PROJECT_LIST')
  }
}
</script>
