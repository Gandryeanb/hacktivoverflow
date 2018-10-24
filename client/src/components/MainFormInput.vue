<template>
  <div class="ui segment form" v-if="post">
    <div class="field">
      <label>Title :</label>
      <input type="text" v-model="titleVal">
    </div>
    <div class="field">
      <label>Description :</label>
      <wysiwyg v-model="descriptionHTML"/>
    </div>
    <div class="field">
      <label>Tags :</label>
      <div style="color:gray; font-size:10px; margin-bottom:5px;">*Separate tag with another tag with blank space</div>
      <input type="text" v-model="tagsVal">
    </div>
    <div class="field" v-if="mode === 'create'">
      <button class="ui mini teal button" @click="createPost">Create</button>
      <button class="ui mini inverted blue button" @click="toPostPage">Cancel</button>
    </div>
    <div class="field" v-if="mode === 'update'">
      <button class="ui mini teal button" @click="updatePost">Update</button>
      <button class="ui mini inverted blue button" @click="toPostPage">Cancel</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/assets/config'

const { host } = config

export default {
  name: 'MainFormInput',
  props: ['mode', 'post'],
  data() {
    return {
      titleVal: '',
      descriptionHTML: '',
      tagsVal: ''
    }
  },
  created() {
    if (this.mode === 'update') {
      this.titleVal = this.post.title
      this.descriptionHTML = this.post.description
      let stringTag = ''

      this.post.tagId.forEach(tag => {
        stringTag += tag.name + ' '
      })
      this.tagsVal = stringTag
    }
  },
  methods: {
    toPostPage() {
      this.$router.push({ path: '/post' })
    },
    createPost() {
      axios({
        url: host + '/post',
        method: 'post',
        headers: {
          token: localStorage.getItem('token')
        },
        data: {
          title: this.titleVal,
          descriptionHTML: this.descriptionHTML,
          tagName: this.tagsVal
        }
      })
        .then(data => {
          this.$emit('reload')
          this.$router.push({ path: '/post' })
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    updatePost() {
      axios({
        url: host + '/post/' + this.post._id,
        method: 'put',
        headers: {
          token: localStorage.getItem('token')
        },
        data: {
          title: this.titleVal,
          descriptionHTML: this.descriptionHTML,
          tagName: this.tagsVal
        }
      })
        .then(data => {
          this.$emit('reload')
          this.$router.push({ path: '/post' })
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
