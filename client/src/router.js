import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Post from './views/Post.vue'
import AllPost from './views/AllPost.vue'
import CreatePost from './views/CreatePost.vue'
import DetailPost from './views/DetailPost.vue'
import UpdatePost from './views/UpdatePost.vue'
import Tag from './views/Tag'
import Verify from './views/Verify.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    name: 'Home',
    component: Home
  }, {
    path: '/Post',
    name: 'Post',
    component: Post,
    children: [{
      path: '/post',
      name: 'AllPost',
      component: AllPost
    }, {
      path: '/post/tag',
      name: 'Tag',
      component: Tag
    }, {
      path: '/post/create',
      name: 'CreatePost',
      component: CreatePost
    }, {
      path: '/post/:id/update',
      name: 'UpdatePost',
      component: UpdatePost
    }, {
      path: '/post/:id',
      name: 'DetailPost',
      component: DetailPost
    }]

  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/verify/:id',
    name: 'Verify',
    component: Verify
  }, {
    path: '/register',
    name: 'Register',
    component: Register
  }]
})
