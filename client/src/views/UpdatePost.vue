<template>
  <MainFormInput :mode="'update'" :post="post" v-if="post !== ''" @reload="$emit('reload')"/>
</template>

<script>
import axios from 'axios'
import config from '@/assets/config'
import MainFormInput from '@/components/MainFormInput'

const { host } = config

export default {
  name: 'UpdatePost',
  data() {
    return {
      post: ''
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      let postId = this.$router.history.current.params.id
      axios({
        url: host + '/post/' + postId,
        method: 'get'
      })
        .then(data => {
          this.post = data.data.data
        })
        .catch(err => {
          console.log(err.message)
        })
    }
  },
  components: {
    MainFormInput
  }
}
</script>

<style>

</style>
