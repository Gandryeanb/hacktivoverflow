<template>
<div>
    <h2 style="color:teal; text-align:center;">
      <i class="ui comment alternate icon"></i>
      Create Question 
    </h2>
  <div class="ui segment form">
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
      <input type="text" v-model="tagsVal">
    </div>
    <div class="field">
      <button class="ui mini teal button" @click="createPost">Create</button>
      <button class="ui mini inverted blue button" @click="$router.push({path: '/post'})">Cancel</button>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import config from '@/assets/config'

const { host } = config

export default {
  name: 'CreatePost',
  data() {
    return {
      titleVal: '',
      descriptionHTML: '',
      tagsVal: ''
    }
  },
  methods: {
    createPost() {
      console.log(this.descriptionHTML)
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
    }
  }
}
</script>

<style>

</style>
