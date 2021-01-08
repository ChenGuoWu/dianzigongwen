<template>
  <div class="main">
    <header-title>公文检索</header-title>
    <div class="header">
      <ul>
        <li class="main-li">
          <div class="main-list">
            <div class="main-list-tittle">收/发文</div>
            <div @click="showPopupReceived">{{ receivedContent }}</div>
            <van-popup
              v-model="showReceived"
              position="bottom"
              :style="{ height: '50%' }"
            >
              <van-picker
                class="fonts"
                show-toolbar
                :columns="columnsReceived"
                @confirm="onConfirm"
                @cancel="onCancel"
              />
            </van-popup>
          </div>
        </li>
        <li class="main-li">
          <div class="main-list">
            <div class="main-list-tittle">标题</div>
            <input type="text" dir="”rtl”" placeholder="请输入" v-model="biaot"/>
          </div>
        </li>
        <li class="main-li">
          <div class="main-list">
            <div class="main-list-tittle">来文字号</div>
            <input type="text" dir="”rtl”" placeholder="请输入" />
          </div>
        </li>
        <li class="main-li">
          <div class="main-list">
            <div class="main-list-tittle">紧急程度</div>
            <div @click="showPopupAll">{{ AllContent }}</div>
            <van-popup
              v-model="showALL"
              position="bottom"
              :style="{ height: '50%' }"
            >
              <van-picker
                class="fonts"
                show-toolbar
                :columns="columnsAll"
                value-key="businessValue"
                @confirm="onConfirmAll"
                @cancel="onCancelAll"
              />
            </van-popup>
          </div>
        </li>
        <li class="main-li">
          <div class="main-list">
            <div class="main-list-tittle">编号</div>
            <input type="text" dir="”rtl”" placeholder="请输入" v-model="bianh"/>
          </div>
        </li>
      </ul>
    </div>
    <div class="footer">
      <van-button type="info" block @click="searchList">检索</van-button>
    </div>
  </div>
</template>
<script>
import {
  getDocumentDeail,
  getWorkItemOptions,
  findBusinessDicts
} from "@/api/api";
import list from "@/pages/common/list.vue";
import { Button, Popup, Picker } from "vant";

export default {
  data() {
    return {
      receivedContent: "收文",
      AllContent: "全部",
      showReceived: false,
      showALL: false,
      columnsReceived: ["收文", "发文"],
      columnsAll: [{businessCode:'',businessValue:'全部'}],
      biaot:'',
      bianh:'',
      faparams:{
					userId:'',
					biaoTi:'',
					faWenBianHao:'',
					faWenZiHao:'',
					jinJiChengDu:'',
					laiWenZiHao:'',
					drafterName:'',
					drafterDepart:'',
					chengWenRiQi:'',					
					startTime:'',
					endTime:'',
					pageSize:'10',
					pageNum:'1'
				},
				shouparams:{
					userId:'',
					biaoTi:'',
					shouWenBianHao:'',					
					shouWenZiHao:'',
					jinJiChengDu:'',
					laiWenLeiBie:'',
					drafterName:'',
					laiWenZiHao:'',
					drafterDepart:'',
					chengWenRiQi:'',
					startTime:'',
					endTime:'',
					pageSize:'10',
					pageNum:'1'
        },
        businessCode:''
    };
  },
  computed: {},
  components: {
    list,
    Button: "van-button",
    Popup: "van-popup",
    mPicker: "van-picker"
  },
  mounted() {    
    //发送请求默认收文的数据
    this.api();
  },
  methods: {
    api() {
      const params = {
        categoryCodes: "emergency_fw",
        companyId: this.state.userInfo.user.companyId
      };
      findBusinessDicts({
        params: params
      }).then(res => {
        if (res.code == 20000) {
          //成功关注改变状态
          res.data.forEach(item => {
            this.columnsAll.push(item);
          });
        }
      });
    },
    showPopupReceived() {
      this.showReceived = true;
    },
    showPopupAll() {
      this.showALL = true;      
    },
    onConfirm(value, index) {
      this.receivedContent = value;
      this.showReceived = false;
    },
    onCancel() {
      this.showReceived = false;
    },
    onConfirmAll(value, index) {      
      this.AllContent = value.businessValue;
      this.businessCode = value.businessCode;
      this.showALL = false;      
    },
    onCancelAll() {
      this.showALL = false;
    },
    searchList() {         
      this.faparams.userId = this.state.userInfo.userId
      this.shouparams.userId = this.state.userInfo.userId
      this.shouparams.jinJiChengDu = this.businessCode
      this.shouparams.biaoTi = this.biaot
      this.faparams.biaoTi = this.biaot
      this.faparams.jinJiChengDu = this.businessCode
      let url = '',
          params = '';
      if (this.receivedContent == "发文") {
        url = "/outDocument/getFaWenDocments";
        params = this.faparams
      } else {
        url = "/inDocument/getShouWenDocments";
        params = this.shouparams
      }
      // 此处加办结是为了，跳转办结或关注页面。为了列表的判断所加
      this.$router.push({
        path: "/DocumentList",
        query: { search: true, item: this.receivedContent+'列表', url: url,bianh:this.bianh,biaot:this.biaot,params:JSON.stringify(params) }
      });
    }
  }
};
</script>
<style scoped>

.main {
  padding: 0;
  color: grey;
}
.main > .header {
  width: 95%;
  margin: 0 auto;
}
.main-li {
  border-bottom: 2px solid #b6b6be;
}
.main-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  line-height: 40px;
  /* font-size: 16px; */
  margin: 0 8px;
}
.main-list .main-list-tittle {
  /* width: 20%; */
  text-align: left;
}
.main-list input {
  width: 70%;
  border: none;
  /* direction: rtl; */
  text-align: right;
  unicode-bidi: bidi-override;
}
.footer {
  margin: 20px auto;
  /* width: 362px; */
  padding: 14px;
  border-radius: 20px;
}
.van-picker__confirm {
  /* font-size: 16px !important; */
}
</style>
