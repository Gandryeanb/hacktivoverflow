<template>
  <div class="ui fluid card">
    <div class="content">
      <div class="meta">
      <a class="avatar left floated">
        <img :src="comment.userId.avatar">
      </a>
      <span> {{ comment.userId.fname }} </span>
        <span class="right floated time" style="font-size:10px;">{{ new Date(comment.createdAt).getDate() }} - {{ new Date(comment.createdAt).getMonth() +1 }} - {{ new Date(comment.createdAt).getFullYear() }}</span>
      </div>
      <div class="description" style="margin-top:20px;" v-html="comment.body">
      </div>
    </div>
    <div class="extra content">
      <div class="ui mini red button" @click="deleteComment" v-if="currentUser.id === comment.userId._id">
        delete
      </div>
      <div class="ui right floated mini labeled button" tabindex="0">
        <div class="ui mini button" :class="{disabled: !currentUser.id || comment.userId._id === currentUser.id || comment.userLike.indexOf(currentUser.id) !== -1}" @click="upvote">
          <i class="chevron up icon"></i> Upvote
        </div>
        <a class="ui mini basic label">
          {{ comment.userLike.length }}
        </a>
      </div>
      <div class="ui right floated mini left labeled button" tabindex="0">
        <a class="ui mini basic right label">
          {{ comment.userDislike.length }}
        </a>
        <div class="ui mini button" :class="{disabled: !currentUser.id || comment.userId._id === currentUser.id || comment.userDislike.indexOf(currentUser.id) !== -1}" @click="downvote">
          <i class="chevron down icon"></i> Downvote
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
  name: 'Answer',
  props: ['comment'],
  computed: {
    ...mapState(['currentUser'])
  },
  methods: {
    upvote() {
      axios({
        url: host + '/comment/up/' + this.comment._id,
        method: 'get',
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(data => {
          this.$emit('reloadData')
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    downvote() {
      axios({
        url: host + '/comment/down/' + this.comment._id,
        method: 'get',
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(data => {
          this.$emit('reloadData')
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    deleteComment() {
      axios({
        url: host + '/comment/' + this.comment._id,
        method: 'delete',
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(data => {
          this.$emit('reloadData')
        })
        .catch(err => {
          console.log(err.response)
        })
    }
  }
}
</script>

<style>

</style>
