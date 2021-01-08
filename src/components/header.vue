<template>
  <div class="top">
    <div class="header">
      <div class="tab">
        <van-icon name="arrow-left" @click="back" class="back"/>
        <van-icon name="cross" class="chacha" @click='gotoshouye'/>
        
        <div v-if="$route.meta.title == '详情'" class="favorites bianhao">
          <div class="" v-if="showBh&&!hideBh">
            <span @click="setBh">编号</span>
          </div>
          <div v-else>
            <van-icon 
              name="star"
              class="favorites"
              v-if="favoritesTemp && favoritesTemp!=='hideFav'"
              @click="changfavoritesTempfalse"
            />
            <van-icon
              name="star-o"
              class="favorites"
              v-else
              @click="changfavoritesTemptrue"
            />
          </div>
        </div>
        <div class="text">
          <slot></slot>
        </div>
        <div v-if="$route.meta.title == '首页'" class="favorites bianhao">
          <van-icon name="search" class="home" @click='gotoseach'/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { payAttention, cancelAttention } from "@/api/api";
import { mapState, mapMutations } from "vuex";
import { Icon } from 'vant';
export default {
  created() {
  },
  components:{
    Icon:'van-icon'
  },
  computed: {
    ...mapState(["favoritesTemp", "showBh", 'hideBh'])
  },
  data(){
    return{
      trueReal:false
    }
  },
  name: "headerTitle",
  props: {
    headerTitle: {
      type: String,
      default: ""
    }
  },
  watch:{
    // 检测编号是否显示
    showBh(newval){
      this.trueReal = newval
    }
  },
  methods: {
    gotoshouye(){
      // 推出前清除本地存储数据
      localStorage.clear()
      // document.write(JSON.stringify(this.$store.state))
      if(window.isTypePhone == 'Android'){				
				railsMobilePlatform.closepage()
			}else{				
				window.webkit.messageHandlers.closepage.postMessage("")
      }      
    },
    setBh() {
      // 编号按钮点击事件
      this.$emit("isShowbh");
    },
    ...mapMutations(["changfavoritesTempfalses", "changfavoritesTemptrues"]),
    back() {
      // 取消临时意见存放
      this.$store.commit('set_cacheOption', null)
      this.$store.commit("set_yijian", {});
      if(this.$route.meta.title=='首页'){
        this.gotoshouye()
      }else{
        window.history.back(-1);
      }
    },
    changfavoritesTemptrue() {
      const params = {
        userId: this.state.userInfo.userId,
        documentId: this.router.documentId || this.router.document_id,
        queryTable: this.router.queryTable
      };
      // 添加关注
      payAttention(params).then(res => {
        if (res.code == 20000) {
          this.changfavoritesTemptrues(); //成功关注改变状态
        }
      });
    },
    changfavoritesTempfalse() {
      console.log(this.router)
      const params = {
        userId: this.state.userInfo.userId,
        objectId: this.router.documentId || this.router.document_id
      };
      // 取消关注 
      cancelAttention(params).then(res => {
        if (res.code == 20000) {
          this.changfavoritesTempfalses(); //取消关注改变状态
        }
      });
    },
    //检索
    gotoseach(){
        this.$router.push({path:'/DocumentSearch/index'})
    }
  }
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 44px;
  text-align: center;
  line-height: 44px;
  color: #ffffff;
  background: rgb(35, 133, 255);
  z-index: 999;
  /* font-size: 18px; */
  font-weight: 700;
}
.chacha{
  position: absolute;
  left: 48px;
  top: 12px;
  font-size: 22px;
  z-index: 9999999999;
}
.tab {
  width: 100%;
  position: absolute;
}
.tab .text {
  /* width: 120px; */
  position: relative;
  /* left: 95%; */
  left: -8px;
  text-align: center;
}
.tab .back {
  width: 14px;
  height: 15px;
  float: left;
  margin-top: 12px;
  /* margin-left: 10px; */
  font-size:22px;
  left: 11px;
  z-index: 999999999;
}
.tab .favorites {
  position: fixed;
  right: 12px;
  top: 9px;
  font-size: 25px;
  z-index: 99999;
}
.bianhao {
  line-height: 24px;
  font-size: 16px !important;
}
.home {
  font-size: 24px;
}
</style>
