<template>
  <div class="ui segment" style="margin-top: 20px;">
    <a href="#" @click="$router.push({path: `/post/${post._id}`})">
      <div class="ui grid">
        <div class="ui two wide column">
          <p style="text-align:center; font-size:12px; color: teal;">Likes</p>
          <button class="ui fluid inverted blue button">{{ post.userLike.length - post.userDislike.length }}</button>
        </div>
        <div class="ui two wide column">
          <p style="text-align:center; font-size:12px; color: teal;">Answer</p>
          <button class="ui fluid inverted blue button">{{ post.commentId.length }}</button>
        </div>
        <div class="ui two wide column">
          <p style="text-align:center; font-size:12px; color: teal;">Views</p>
          <button class="ui fluid inverted blue button">{{ post.views.length }}</button>
        </div>
        <div class="ui six wide column">
          <div class="column">
            <p style="text-align:left; font-size:17px; color: teal; font-weight: bold">{{ post.title }}</p>
            <div style="height: 5px;"></div>
          </div>
          <div class="column">
            <label class="ui mini label" style="margin-top:5px;" v-for="(tag, index) in post.tagId" :key="index">{{ tag.name }}</label>
          </div>
        </div>
        <div class="ui four wide column">
          <div class="column" style="text-align: right">
            <img class="ui mini avatar image" :src="post.userId.avatar">
            <span>{{ post.userId.fname }}</span>
            <br>
            <br>
            <br>
            <p style="color: grey; margin-top:-20px; font-size:12px; text-align:right">Asked: {{ new Date(post.createdAt).getDate() }} - {{ new Date(post.createdAt).getMonth() +1 }} - {{ new Date(post.createdAt).getFullYear() }}</p>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script>
export default {
  name: 'PostCard',
  props: ['post']
}
</script>

<style>

</style>
