<template>
  <div id="app" v-cloak>
    <loading v-show="showloading" :key="key"></loading>    
    <!-- <router-view/> -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

  </div>
</template>

<script>
import loading from '@/components/loading.vue'
import {mapState} from 'vuex'

export default {
  name: 'App',
  data(){
    return{
      headerTitle:'电子公文'
    }
  },
  components:{loading},
  computed:{
    ...mapState(['showloading']),    
    key() {
      return this.$route.name !== undefined? this.$route.name +new Date(): this.$route +new Date()
    }
  },
  mounted(){
    
  },
  methods:{
    // 存放基础信息
    
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 50px;  
  height: auto;
  font-size:16px ;
}
[v-cloak]{
  display: none
}
.ivu-tree-empty{
  /* font-size: 18px; */
  text-align: center;
  margin-top: 80px;
}
body{
    
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
    
}
textarea{
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none;
}
</style>
