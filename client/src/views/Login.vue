<template>
  <div class="ui centered grid">
    <div class="ui four wide column" style="margin-top: 50px;">
      <h2 style="color: teal">Login</h2>
      <div class="ui segment form">
        <div class="ui field">
          <label>Email: </label>
          <div class="ui icon input">
            <i class="ui user icon"></i>
            <input type="text" placeholder="Email" v-model="emailForm">
          </div>
        </div>
        <div class="ui field">
          <label>Password: </label>
          <div class="ui icon input">
            <i class="ui lock icon"></i>
            <input type="Password" placeholder="Password" v-model="passwordForm">
          </div>
        </div>
        <div class="ui field">
            <button class="ui teal fluid button" @click="login">Login</button>
        </div>
        <div class="ui field">
          <div id="my-signin2" style="width:100px" @click="loginGoogle"></div>
        </div>
        <div class="ui field">
          <div class="" v-if="notif.header" :class="propertyNotif">
            <div class="header">
              {{ notif.header }}
            </div>
            <p>{{ notif.msg }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/assets/config'
import { mapActions, mapState } from 'vuex'

const { host } = config

export default {
  name: 'Login',
  data() {
    return {
      emailForm: '',
      passwordForm: '',

      propertyNotif: '',
      notif: {
        header: null,
        msg: null
      }
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created() {
    let token = localStorage.getItem('token')
    if (token) {
      this.$router.push({ path: '/' })
    }
  },
  mounted() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 320,
      onsuccess: this.loginGoogle
    })
  },
  methods: {
    ...mapActions(['getCurrentUser', 'resetShowSearchBox']),
    loginGoogle(val) {
      let token = val.Zi.id_token
      axios({
        url: host + '/users/login/google',
        headers: {
          token: token
        }
      })
        .then(data => {
          localStorage.setItem('token', data.data.token)
          this.getCurrentUser()
          this.resetShowSearchBox(true)
          this.$router.push({ path: '/' })
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    login() {
      axios({
        url: host + '/users/login',
        method: 'post',
        data: {
          email: this.emailForm,
          password: this.passwordForm
        }
      })
        .then(data => {
          localStorage.setItem('token', data.data.token)
          this.getCurrentUser()
          this.resetShowSearchBox(true)
          this.$router.push('/')
        })
        .catch(err => {
          console.log(err.response.data.message)
          this.propertyNotif = 'ui mini negative message'
          this.notif = {
            header: 'Your user registration was unsuccessful.',
            msg: err.response.data.message
          }
        })
    }
  }
}
</script>

<style>

</style>
