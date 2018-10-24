<template>
  <div class="ui centered grid">
    <div class="ui twelve wide column">
      <h3 style="color:teal">
        {{ post.title }}
        </h3>
    </div>
    <div class="ui four wide column">
      <button class="ui teal mini right floated button" @click="$router.push({path: '/post'})">All post</button>
    </div>
    <div class="ui sixteen wide column">
      <div class="ui segment teal">
        <div class="ui grid">
          <div class="ui two wide column">
            <div class="ui vertical icon menu">
              <div class="item link" v-if="currentUser.id !== post.userId._id && currentUser.id && post.userLike.indexOf(currentUser.id) == -1 " @click="upvote">
                <i class="ui small chevron up icon"></i>
              </div>
              <div class="item disabled link" v-else>
                <i class="ui small chevron up icon"></i>
              </div>
              <div class="item">
                <h4 class="ui center floated ">{{ post.userLike.length - post.userDislike.length }}</h4>
              </div>  
              <div class="item link" v-if="currentUser.id !== post.userId._id && currentUser.id && post.userDislike.indexOf(currentUser.id) == -1 " @click="downvote">
                <i class="ui small chevron down icon"></i>
              </div>
              <div class="item disabled link" v-else>
                <i class="ui small chevron down icon"></i>
              </div>
            </div>
          </div>
          <div class="ui fourteen wide column">
            <div style="font-size: 13px; color:gray; text-align:right;">
              <i class="ui eye icon"></i>
              {{ post.views.length }}
            </div>
            <img class="ui mini rounded image" style="margin-top:-20px" :src="post.userId.avatar">
            <span>{{post.userId.fname}}</span>
            <div v-html="post.description" style="margin-top:10px; margin-bottom: 20px;"></div>
            <span style="font-size: 13px; color:gray">Tags: </span>
            <label class="ui mini label" v-for="(tag, index) in post.tagId" :key="index">{{ tag.name }}</label>
          </div>
        </div>
      </div>
    </div>
    <div class="ui sixteen wide column" v-if=" currentUser.id === post.userId._id" style="margin-top: -20px;">
      <button class="ui mini  right floated red button" @click="removePost">
        <i class="ui trash icon"></i>
        remove</button>
      <button class="ui mini right floated teal button" @click="$router.push({ path: `/post/${post._id}/update` })">
        <i class="ui pencil icon"></i>
        edit</button>
    </div>
    <div class="ui sixteen wide column">
      <div class="ui dividing header">
        <div class="header">
          {{ post.commentId.length }} Answer
        </div>
      </div>
    </div>
    <div class="ui sixteen wide column">
      <Answer v-for="(comment,index) in post.commentId" :key="index" :comment="comment" @reloadData="getPost" />
    </div>
    <div class="ui sixteen wide column">
      <div class="ui segment form">
        <div class="field">
          <label>Your answer :</label>
          <wysiwyg v-model="commentHTMLInput"/>
        </div>
        <div class="field">
          <button class="ui small fluid teal button" @click="createAnswer" :class="{ disabled: !currentUser.id }">Submit</button>
        </div>
      </div>
    </div>
    <div style="margin-bottom: 50px;"></div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/assets/config'
import Answer from '@/components/Answer'
import { mapState } from 'vuex'
const { host } = config

export default {
  name: 'DetailPost',
  data() {
    return {
      post: {},

      commentHTMLInput: ''
    }
  },
  computed: {
    ...mapState(['currentUser'])
  },
  created() {
    this.getPost()
  },
  mounted() {},
  methods: {
    removePost() {
      axios({
        url: host + '/post/' + this.post._id,
        method: 'delete',
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(data => {
          this.$emit('reload')
          this.$router.push({ path: '/post' })
        })
        .catch(err => {
          console.log(err)
        })
    },
    upvote() {
      axios({
        url: host + '/post/up/' + this.post._id,
        method: 'get',
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(data => {
          this.getPost()
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    downvote() {
      axios({
        url: host + '/post/down/' + this.post._id,
        method: 'get',
        headers: {
          token: localStorage.getItem('token')
        }
      })
        .then(data => {
          this.getPost()
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    createAnswer() {
      console.log(host + '/comment/' + this.post._id)
      axios({
        url: host + '/comment/' + this.post._id,
        method: 'post',
        headers: {
          token: localStorage.getItem('token')
        },
        data: {
          commentHTMLInput: this.commentHTMLInput
        }
      })
        .then(data => {
          this.getPost()
          this.$emit('reload')
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    viewsUpdater() {
      if (
        this.currentUser &&
        this.post.views.slice(this.post.views.length - 1).indexOf(this.currentUser.id) &&
        this.post.userId._id !== this.currentUser.id
      ) {
        axios({
          url: host + '/post/view/' + this.post._id,
          method: 'put',
          headers: {
            token: localStorage.getItem('token')
          }
        })
          .then(data => {
            this.$emit('reload')
            this.getPost()
          })
          .catch(err => {
            console.log('failed to updated viewed for this post')
          })
      }
    },
    getPost() {
      let postId = this.$router.history.current.params.id
      axios({
        url: host + '/post/' + postId,
        method: 'get'
      })
        .then(data => {
          this.post = data.data.data
          this.$emit('reload')
          setTimeout(() => {
            this.viewsUpdater()
          }, 50)
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  },
  components: {
    Answer
  }
}
</script>

<style>

</style>
