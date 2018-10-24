<template>
  <div>
    Home
  </div>
</template>

<script>
export default {
  name: 'Home',
  created() {
    this.$router.push({ path: '/post' })
  }
}
</script>

<style>

</style>
