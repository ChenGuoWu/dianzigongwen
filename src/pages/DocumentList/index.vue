<template>
  <div class="main">
    <header-title>{{ router.item }}</header-title>
    <van-pull-refresh
      @refresh="onRefresh"
      success-text="已刷新成功"
      v-model="isLoading"
      animation-duration='600'
    >
      <van-list
        v-model="Loadinglist"
        :finished="finished"
        :immediate-check="false"
        :offset="50"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="(item, index) in listData"
          :key="index"
          class="root"
          @click="detalis(item)"
        >
          <div class="one">
            <div class="bianhao">
              <div class="leftcode">
                {{
                  item.shouWenBianHao ||
                    item.faWenBianHao ||
                    item.shou_wen_bian_hao ||
                    item.fa_wen_bian_hao
                }}
              </div>
              <div class="rightcode">
                <van-tag
                    color="#ffe1e1" text-color="#ad0000"
                    v-if="showGfwj(item)"
                >
                  规范
                </van-tag>
                <van-tag
                    color="#ffe1e1" text-color="#ad0000"
                    v-if="showHuiqian(item)"
                >
                  会签
                </van-tag>
                <!-- <div class="emergency" v-show="item.jinJiChengDu!=''"></div> -->
                <van-tag
                  
                  color="#ffe1e1" text-color="#ad0000"
                  v-if="show(item.jin_ji_cheng_du || item.jinJiChengDu)"
                  >{{
                    emergencyCodes(item.jin_ji_cheng_du || item.jinJiChengDu)
                  }}</van-tag
                >
                <!-- <div style="color:rgb(103, 194, 58)">
                  {{ flowCodes(item.workflowCode) }}
                </div> -->
              </div>
            </div>
          </div>
          <div class="one">
            <div class="cneterTitle">
              <!-- {{item.hasOwnProperty('isInvalid')&&item.isInvalid==1?'此文作废':'前文作废，以此为准'}} -->
              <span>
                <van-tag color="#ffe1e1" text-color="#ad0000" v-if="item.isInvalid&&item.isInvalid!=0" class="tag_doc">
                  {{doisInvalid(item)}}
                </van-tag>
                <span :style="{'color':item.isRead&&item.isRead!=0?'gray':''}">{{ item.biaoTi || item.biao_ti || item.biaoti }}</span>
              </span>
            </div>
            <div class="biaoti" style="border-bottom: 1px solid #eeeeee;">
              <span>{{ item.drafterName || item.drafter_name }}</span>
              <span>{{ item.drafterDate || item.drafter_date }}</span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script>
import {
  docList,
  getAttentionList,
  findBusinessDicts,
  getSearchConditionByCompany
} from "@/api/api";
let emergency = [];
let CategoryCode = [];
export default {
  data() {
    return {
      loading: true,
      params: {
        //列表参数
        userId: "",
        biaoTi: "",
        laiWenZiHao: "",
        shouWenBianHao: "",
        faWenBianHao: "",
        pageSize: 10,
        pageNum: 1,
        isFinish: ""
      },
      attentionP: {
        queryTable: "",
        pageSize: 10,
        pageNum: 1,
        userId: ""
      },
      listData: [],
      isLoading: false,
      finished: false,
      Loadinglist: false,
      searchPage:1,
      beiAnShenCha:false
    };
  },
  computed: {
    store() {
      return this.$store.state.userInfo;
    }
  },
  updated() {
    // 处理未匹配到的紧急程度
    let dom = document.getElementsByClassName('van-tag')
    for (let index = 0; index < dom.length; index++) {
      if(dom[index].innerHTML == ''){
        dom[index].style.display = 'none'
      }
    }
  },
  mounted() {
    // 获取数字字典，紧急程度，公文类型
    this.findBusinessDictsApi();
    // this.getSearchConditionByCompanyApi();    
  },
  beforeRouteEnter(to, from, next) {
    next(res => {      
      res.router.item.indexOf("关注") > -1 ? res.attention() : res.getList();
    });
  },
  methods: {
    doisInvalid(item){
      if(item.isInvalid == 1){
        return '此文作废'
      }else if(item.isInvalid == 2){
        return '前文作废,以此文为准'
      }
    },
    detalis(p) {
      let doctype = "",
        queryTable = "",
        requestType = "";
      //判断收发文类型，传递判断值
      
      // 收发文列表判断
      this.router.url.indexOf("out") > -1
        ? ((doctype = "outgoing"), (queryTable = "oa_outgoing_data"))
        : ((doctype = "incoming"), (queryTable = "oa_incoming_data"));
      p.doctype = doctype;
      p.queryTable = queryTable;
      // 接口数据不全，暂时本地字段判断展示
      // switch (p.workitemType) {
      //     case 'ToDo':
      //         requestType = 'dai_ban'
      //         break;
      //     case 'ToRead':
      //         requestType = 'dai_yue'
      //         break;
      //     default:
      //         break;
      // }
      switch (this.router.item) {
        case "待办":
          p.workitemType == "ZhengXun"
            ? (requestType = "dai_zheng_xun")
            : (requestType = "dai_ban");
          break;
        case "交办":
          p.workitemType == "ZhengXun"
            ? (requestType = "dai_zheng_xun")
            : (requestType = "dai_ban");
          break;    
        case "待阅":
          requestType = "dai_yue";
          break;        
        case "已办":
          requestType = "yi_ban";
          break;        
        case "已阅":
          requestType = "yi_yue";
          break;        
        case "流转":
          p == "ZhengXun"
            ? (requestType = "yi_zheng_xun")
            : (requestType = "liu_zhuan");
          break;
        default:
          break;
      }     
      p.requestType = requestType;
      let navTo = this.router.item;
      if (navTo.indexOf("待办") > -1 || navTo.indexOf("交办")>-1) {
        this.$router.push({
          path: "/DocumentToDo/Document",
          query: p
        });
      } else if (navTo.indexOf("待阅") > -1) {
        this.$router.push({
          path: "/DocumentToRead/index",
          query: p
        });
      } else if (navTo.indexOf("已办") > -1 || navTo.indexOf("流转") > -1) {
        this.$router.push({
          path: "/DocumentToFinish/index",
          query: p
        });
      } else if (navTo.indexOf("已阅") > -1) {
        this.$router.push({
          path: "/DocumentReadFinish/index",
          query: p
        });
      } else if (navTo.indexOf("关注") > -1 || navTo.indexOf("办结") > -1|| navTo.indexOf("列表") > -1) {
        this.$router.push({
          path: "/DoucumentAttentionFinish/index",
          query: p
        });
      }
    },
    // 关注公文列表
    attention() {
      this.attentionP.userId = this.state.userInfo.userId;
      this.attentionP.queryTable = this.router.params;
      getAttentionList(this.attentionP).then(res => {
        if (this.params.pageNum != 1 && this.finished != true) {
          this.listData.push(...res.data);
        } else {
          this.listData = res.data;
        }
        if (res.total <= this.listData.length) {
          this.finished = true;
        }
      });
    },
    // 上拉加载
    onLoad() {
      setTimeout(() => {
        // 检索page判断
        if(this.router.search){
          this.searchPage++
        }else{
          this.params.pageNum++
        }        
        this.getList();
      }, 1000);
    },
    // 待办待阅等列表
    getList() {
      if(this.router.item.indexOf('已办')>-1){
        this.params.isFinish = 0
      }else if(this.router.item.indexOf('办结')>-1){
        this.params.isFinish = 1
      }else if(this.router.item.indexOf('流转')>-1){
        this.params.isFinish = 2
      }
      let params = {}
      if(this.router.search){
        this.params = JSON.parse(this.router.params)
        this.params.pageNum = this.searchPage
      }else{
        this.params.userId = this.state.userInfo.userId;        
      }

      let url = JSON.parse(JSON.stringify(this.router.url));
      
      docList("/" + url, {
        params: this.params
      }).then(res => {
        if (this.finished == false && this.params.pageNum != 1) {
          this.listData.push(...res.data);
        } else {
          this.listData = res.data;
        }
        if (res.total <= this.listData.length) {
          this.finished = true;
        }else{
          this.finished = false;
        }
        // 每次加载完都要设置为false
        this.Loadinglist = false
      });
    },   
    showGfwj(item){
      if(!item.hasOwnProperty('beiAnShenCha'))return
      if(item.beiAnShenCha === '0')return
      return true
    },
    showHuiqian(item){
      if(item.handoutType == 'countersign')return true
    },
    emergencyCodes(code) {
      let emergencynames = "";
      emergency.forEach(val => {
        if (val.businessCode == code) {
          emergencynames = val.businessValue;
          return;
        }
      });
      return emergencynames;
    },
    show(e) {
      if (e != "" && e != undefined && emergency.length) {
        return true;
      }
      return false;
    }, 
    flowCodes(code) {
      let codename = "";
      CategoryCode.forEach(val => {
        if (val.businessCode == code) {
          codename = val.businessValue;
          return;
        }
      });
      return codename;
    },
    findBusinessDictsApi() {
      findBusinessDicts({
        params: {
          categoryCodes: 'emergency_fw',
          companyId: ''
        }
      }).then(res => {
        emergency = res.data;
      });
    },
    getSearchConditionByCompanyApi() {
      getSearchConditionByCompany({
        params: {
          categoryCode: "document_type",
          companyId: ''
        }
      }).then(res => {
        CategoryCode = res.data;
      });
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        // 初始化页数变成1
        if(this.router.search){
          this.searchPage = 1
        }else{
          this.params.pageNum = 1
        }
        this.finished = true
        this.listData = [];
        this.router.item.indexOf("关注") > -1 ? this.attention() : this.getList();
        this.isLoading = false;
        this.Loadinglist = false
      }, 1000);
    }
  }
};
</script>
<style scoped>
.main{
  position: absolute;
  width: 100%;
  height: auto;
}
.van-pull-refresh{
  height: 100%;
}
.root {
  /* font-size: 18px; */
  background-color: white;
  margin-bottom: 1px;
}
.bianhao {
  color: rgb(30, 108, 254);
}
.biaoti {
  text-align: left;
  word-break: break-all;
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
  color: gray;
}
.one {
  padding: 0 10px;
  margin-top: 6px;
  /* font-size: 18px; */
}
.one div {
  text-align: left;
  display: flex;
  justify-content: space-between;
}
.bianhao {
  /* font-size: 16px; */
}
.tag_doc{
  font-size: 15px;
  margin-right: 0px!important;
}
.cneterTitle{
  text-align: left;
  word-break: break-all;
  padding: 5px 0;
  display: flex;
  justify-content: flex-start;
}
.emergency {
  border: 1px #e25bff solid;
  border-radius: 7px;
  margin-right: 5px;
  padding: 1px;
  width: 100px;
  height: 100px;
}

.rightcode {
  display: flex;
  justify-content: space-around;
  width: auto;
}
.leftcode {
  width: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  white-space: nowrap;
  -webkit-line-clamp: 1;
}
/deep/.van-tag {
  margin-right: 8px;
  height: 23px;
}
.van-tag--primary{
  background-color:rgb(30, 108, 254)
}
</style>
