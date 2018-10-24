<template>
  <div class="ui grid">
    <div class="ui sixteen wide column"> 
      <div class="ui three cards">
        <div class="ui link teal card" v-for="(tag, index) in tags" :key="index">
          <div class="content">
            <div class="header">{{ tag.name }}</div>
            <div class="description">
              <p></p>
            </div>
          </div>
          <div class="extra content">
            <span class="left floated like">
              <i class="chat icon"></i>
              {{ tag.postId.length }} question
            </span>
          </div>
        </div>
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
  name: 'Tag',
  data() {
    return {
      tags: []
    }
  },
  created() {
    this.getTagData()
  },
  methods: {
    ...mapActions(['resetShowSearchBox']),
    getTagData() {
      axios({
        url: host + '/tag',
        method: 'get'
      })
        .then(data => {
          this.tags = data.data.data
          this.resetShowSearchBox()
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  }
}
</script>

<style>

</style>
