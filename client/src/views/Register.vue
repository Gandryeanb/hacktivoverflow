<template>
  <div class="ui centered grid">
    <div class="ui seven wide column" style="margin-top: 100px;">
      <h2 style="color: teal">Register</h2>
      <div class="ui segment form">
        <div class="ui two fields">
          <div class="ui field required">
            <label>First Name:</label>
            <input type="text" placeholder="First name" v-model="fnameForm">
          </div>
          <div class="ui field">
            <label>Last Name:</label>
            <input type="text" placeholder="Last name" v-model="lnameForm">
          </div>
        </div>
        <div class="ui three fields">
          <div class="ui field required">
            <label>Email: </label>
            <div class="ui icon input">
              <i class="ui mail icon"></i>
              <input type="text" placeholder="Email" v-model="emailForm">
            </div>
          </div>
          <div class="ui field required">
            <label>Password: </label>
            <div class="ui icon input">
              <i class="ui lock icon"></i>
              <input type="password" placeholder="Password" v-model="pass1Form">
            </div>
          </div>
          <div class="ui field required">
            <label>Password: </label>
            <div class="ui icon input">
              <i class="ui lock icon"></i>
              <input type="password" placeholder="Password" v-model="pass2Form">
            </div>
          </div>
        </div>
        <div class="ui field" style="margin-top: 20px;">
          <button class="ui teal small fluid button" @click="register">Submit</button>
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
import { mapState } from 'vuex'

const { host } = config

export default {
  name: 'Register',
  data() {
    return {
      fnameForm: '',
      lnameForm: '',
      emailForm: '',
      pass1Form: '',
      pass2Form: '',

      propertyNotif: 'ui mini positive message',
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
  methods: {
    register() {
      if (this.pass1Form === this.pass2Form && this.pass1Form !== '') {
        axios({
          url: host + '/users/register',
          method: 'post',
          data: {
            fname: this.fnameForm,
            lname: this.lnameForm,
            email: this.emailForm,
            password: this.pass1Form
          }
        })
          .then(data => {
            console.log(data.data)
            this.propertyNotif = 'ui mini positive message'
            this.notif = {
              header: 'Your user registration was successful.',
              msg: 'You may now verify you account and login to the login page'
            }

            setTimeout(() => {
              this.$router.push({ path: '/login' })
            }, 5000)
          })
          .catch(err => {
            console.log(err.response)
            this.propertyNotif = 'ui mini negative message'
            this.notif = {
              header: 'Your user registration was unsuccessful.',
              msg: err.response.data.message
            }
          })
      } else {
        console.log(`your password did'nt match`)
        this.propertyNotif = 'ui mini negative message'
        this.notif = {
          header: 'Your user registration was unsuccessful.',
          msg: "your password did'nt match"
        }
      }
    }
  }
}
</script>

<style>

</style>
