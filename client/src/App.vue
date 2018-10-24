<template>
  <div id="app">
    <NavBarTop @queryPost="queryChanger($event)"/>
    <router-view style="margin-top:70px;" :query="query"/>
  </div>
</template>

<script>
import NavBarTop from '@/components/NavBarTop'
import { mapActions } from 'vuex'
export default {
  name: 'app',
  data() {
    return {
      query: ''
    }
  },
  created() {
    let token = localStorage.getItem('token')
    if (token) {
      this.getCurrentUser()
    }
  },
  methods: {
    ...mapActions(['getCurrentUser']),
    queryChanger(val) {
      this.query = val
    }
  },
  components: {
    NavBarTop
  }
}
</script>

<style>
  @import "~vue-wysiwyg/dist/vueWysiwyg.css";
</style>
