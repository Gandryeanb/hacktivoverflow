<template>
<div>
  <div class="ui grid">
    <div class="ui eight wide column">
      <h3 style="color:teal">
        <i class="ui comment alternate icon"></i>
        Recently Created Question :
        </h3>
    </div>
    <div class="ui eight wide column">
      <button class="ui teal mini right floated button" @click="$router.push({path: '/post/create'})">Ask Question</button>
    </div>
  </div>
  <PostCard v-for="(post, index) in postList" :key="index" :post="post"/>
</div>
</template>

<script>
import PostCard from '@/components/PostCard'
import { mapActions } from 'vuex'

export default {
  name: 'AllPost',
  props: ['postList'],
  components: {
    PostCard
  },
  created() {
    console.log('masuk post')
    this.resetShowSearchBox(true)
  },
  methods: {
    ...mapActions(['resetShowSearchBox'])
  }
}
</script>

<style>

</style>
