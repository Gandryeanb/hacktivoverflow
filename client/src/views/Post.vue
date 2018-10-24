<template>
  <div class="ui centered grid">
    <div class="ui two wide column">
      <div class="ui vertical menu" style="position: fixed; width: 11%;">
        <div class="ui segment">
          <a class="link item" @click="goTopagePost" :class="{active: currentRoute == '/post'}">
            <i class="ui home icon"></i>
            Home
          </a>
          <div class="link item" @click="goTopageTag" :class="{active: currentRoute == '/post/tag'}">
            Tags
          </div>
          <div class="link disabled item">
            Users
          </div>
        </div>
      </div>
    </div>
    <div class="ui seven wide column">
      <router-view @reload="getAllPost" :postList="postList"/>
    </div>
    <div class="ui two wide column">
      <div class="ui segment">

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/assets/config'
import { mapActions } from 'vuex'

const { host } = config

export default {
  name: 'Post',
  props: ['query'],
  data() {
    return {
      postList: [],
      currentRoute: '/'
    }
  },
  watch: {
    query() {
      if (this.query != '') {
        this.getPostByQuery()
      } else {
        this.getAllPost()
      }
    }
  },
  created() {
    this.getAllPost()
    this.currentRoute = this.$router.history.current.path
  },
  methods: {
    ...mapActions(['resetShowSearchBox']),
    goTopagePost() {
      this.currentRoute = '/'
      this.$router.push({ path: '/' })
      this.resetShowSearchBox(true)
    },
    goTopageTag() {
      this.currentRoute = '/post/tag'
      this.$router.push({ path: '/post/tag' })
      this.resetShowSearchBox(false)
    },
    getPostByQuery() {
      axios({
        url: host + '/post/search/' + this.query,
        method: 'get'
      })
        .then(data => {
          this.postList = data.data.data
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    getAllPost() {
      axios({
        url: host + '/post',
        method: 'get'
      })
        .then(data => {
          this.postList = data.data.data
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  },
  components: {}
}
</script>

<style>

</style>
