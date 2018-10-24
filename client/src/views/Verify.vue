<template>
  <div></div>
</template>

<script>
import axios from 'axios'
import config from '@/assets/config'

const { host } = config

export default {
  name: 'Verify',
  created() {
    let verifyToken = this.$router.history.current.params.id
    axios({
      url: host + '/users/verify/' + verifyToken,
      method: 'get'
    })
      .then(data => {
        this.$router.push({ path: '/login' })
      })
      .catch(err => {
        console.log(err.response)
      })
  }
}
</script>

<style>

</style>
