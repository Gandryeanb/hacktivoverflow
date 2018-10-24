<template>
<div>
  <div class="ui centered grid segment" style="position: fixed; width: 100%;  top: 0; margin-top: 0px; z-index:9">
    <div class="ui two wide column">
      <a href="#"><h2 style="color:teal;" @click="toHomePage">
        Hackverflow
      </h2></a>
    </div>
    <div class="ui seven wide column form">
      <div class="ui fluid small icon input" v-if="showSearchBar || changeShowSearchBox">
        <i class="search icon"></i>
        <input type="text" placeholder="Search Question.." v-model="searchQuery">
      </div>
    </div>
    <div class="ui two wide column">
      <img class="ui avatar mini image" :src="currentUser.avatar" width="33" v-if="currentUser.id">
      <span v-if="currentUser.id">{{ currentUser.fname }}</span>
      <div v-if="!currentUser.id">
        <button class="ui mini right floated teal button" @click="toLoginPage" v-if="showLoginBtn">login</button>
        <button class="ui mini right floated teal button" @click="toRegisterPage"v-if="showRegistBtn">register</button>
      </div>
      <button class="ui mini right floated teal button" @click="logout" v-else>logout</button>
    </div>
  </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'NavBarTop',
  data() {
    return {
      showSearchBar: false,
      showRegistBtn: true,
      showLoginBtn: true,

      searchQuery: ''
    }
  },
  computed: {
    ...mapState(['currentUser', 'changeShowSearchBox'])
  },
  created() {
    let path = this.$router.history.current.path

    if (path !== '/post') {
      this.showSearchBar = false
    } else {
      console.log(this.$router.history.current.path)
    }
  },
  watch: {
    searchQuery() {
      this.$emit('queryPost', this.searchQuery)
    },
    currentUser: {
      handler() {
        if (this.currentUser.id === null) {
          this.showRegistBtn = true
          this.showLoginBtn = true
        }
      },
      deep: true
    },
    changeShowSearchBox: {
      handler() {
        if (this.changeShowSearchBox) {
          this.showSearchBar = true
          console.log('cgange search bar show')
        } else {
          this.showSearchBar = false
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['resetCurrentUser']),
    toLoginPage() {
      this.$router.push({ path: '/login' })
      this.showSearchBar = false
      this.showRegistBtn = true
      this.showLoginBtn = false
    },
    toHomePage() {
      this.$router.push({ path: '/' })
      this.showSearchBar = true
      this.showRegistBtn = true
      this.showLoginBtn = true
    },
    toRegisterPage() {
      this.$router.push({ path: '/register' })
      this.showSearchBar = false
      this.showRegistBtn = false
      this.showLoginBtn = true
    },
    logout() {
      localStorage.removeItem('token')
      this.resetCurrentUser()
      this.showRegistBtn = true
      this.showLoginBtn = true
    }
  }
}
</script>

<style scoped>

</style>
