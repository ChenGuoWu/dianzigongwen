<template>
  <div class="main">
    <van-tabs @click="tabCilck" v-if="showTab" v-model="active">
      <van-tab v-for="(item,index) in [{id:0,title:'收文稿纸'},{id:1,title:'原始稿纸'}]" :title="item.title" :key="index">

      </van-tab>
    </van-tabs>
    <header-title @isShowbh="getData">{{ router.item || doctype.indexOf('outgoing')>-1?'发文详情':'收文详情' }}</header-title>
    <div style="text-align:left" class="height">{{doctype.indexOf('outgoing')>-1?'发文基本信息':'收文基本信息'}}</div>
    <van-skeleton title :row="6" :loading="loading" />    
    <div class="xinxi linebold">
      <div v-for="(item, index) in doc_xinxi" :key="index">
        <div class="row" style="word-break: break-all">{{ item.infoType }}:{{ item.infoValue }}</div>
      </div>
      <div class="row" style="word-break: break-all" v-if="doctype.indexOf('outgoing')>-1">合法性审查：{{isHfxsc}}</div>
      <div class="row" style="word-break: break-all" v-if="doctype.indexOf('outgoing')>-1">会签部门：{{isHqbm}}</div>
    </div>
    <div class="linebold height">
      <div class="line height">正文</div>
      <div class="fileHeight">
        <div class="file" v-for="(item, index) in zwfile" :key="index">
          <div v-if="item.file_category == 'mainBody'" @click="saveFile(item)">
            {{ item.real_name }}
          </div>
        </div>
      </div>
    </div>
    <div class="linebold height" v-if="attachment">
      <div class="line height">附件</div>
      <div class="fileHeight">
        <div class="file" v-for="(item, index) in zwfile" :key="index">
          <div
            v-if="item.file_category == 'attachment'"
            @click="saveFile(item)"
          >
            {{ item.real_name }}
          </div>
        </div>
      </div>
    </div>
    <div class="linebold height" v-if="relation">
      <div class="line height">关联文档</div>
      <div class="file" v-for="(item, index) in zwfile" :key="index">
        <div v-if="item.file_category == 'relation'" @click="saveFile(item)">
          {{ item.real_name }}
        </div>
      </div>
    </div>
    <div class="linebold" v-if="receive_note.length != 0">
      <div class="option line">
        <div class="height">便签</div>
        <!-- <div style="color:blue;" @click="fold">{{flag?'展开':'收起'}}</div> -->
      </div>
      <div v-for="(item, index) in receive_note" :key="index" class="line">
        <div>
          <div>
            <span style="color:rgb(240, 173, 78);font-weight:bold">来自（{{ item.submitUserName }}）的便签</span>:{{ item.noteContent }}
          </div>
        </div>
      </div>
      <div v-for="(item, index) in submit_note" :key="index+1" class="line">
        <div>
          <div>
            <span style="color:rgb(240, 173, 78);font-weight:bold">发自（{{ item.receiveUserName }}）的便签</span>:{{ item.noteContent }}
          </div>
        </div>
      </div>
    </div>
    <div class="linebold">
      <template v-for="item in showOptions">
        <div class="option line" v-if="item.lengths>0">
          <div class="height">{{item.title}}({{ item.lengths }})</div>
          <div style="color:rgb(30, 108, 254);" @click="item.flagVal = !item.flagVal" v-if="item.lengths>2 && item.model!='mobileLeaderOpinion'">
            {{ item.flagVal ? "展开" : "收起" }}
          </div>
          </div>
          <div v-for="(items, index) in item.flagVal?dbshow(item.model):evalFun('this.'+item.model)" :key="items.id" class="line noneLine">
            <div>
              <div>
                <span class="fontBlod">{{item.lengths-index}}.{{ items.approvalUserName }}（{{ items.displayName }}）</span>:{{
                  items.approvalOpinionInput
                }}
              </div>
              <div class="time">
                <div>{{ items.approvalDepartment }}</div>
                <div>{{ items.approvalDate }}</div>
              </div>
            </div>
          </div>
        </template>
    </div>
    <div class="linebold height liuc" @click="getflow">
      <div>流程跟踪</div>
      <van-icon name="arrow" />
    </div>
    <van-dialog
      v-model="dialog"
      title="编号选择"
      show-cancel-button
      @confirm="confirm()"
      @cancel="cancel()"
    >
      <van-tabs @click="onClick">
        <van-tab title="流水号" class="tab1">
          <div
            v-for="(item, index) in candidateNoList"
            :key="index"
            class="left"
          >
            <div @click="selected(item)">{{ item.curFullNumber }}</div>
          </div>
          <p style="text-align:center;height:50px" v-if="candidateNoList.length == 0">暂无数据</p>
        </van-tab>
        <van-tab title="预留号">
          <div
            v-for="(item, index) in reservationNoList"
            :key="index"
            class="left"
          >
            <div @click="selected(item)">{{ item.curFullNumber }}</div>
          </div>
          <p
            style="text-align:center;height:50px"
            v-if="reservationNoList.length == 0"
          >
            暂无数据
          </p>
        </van-tab>
      </van-tabs>
      <div class="textsp">
        <div style="text-align:left">已选编号</div>
        <div class="bottominp">
          <span>{{ fontStyle }}{{ year }}</span
          ><input
            type="text"
            v-model="number"
            class="inputNum"
          /><span>{{ str }}</span>
        </div>
      </div>
    </van-dialog>
  </div>
</template>
<script>
import {
  docList,
  getAttentionList,
  getCandidateNo,
  validateNo,
  savedoc,
  viewUrl
} from "@/api/api";
export default {
  data() {
    return {
      flag: true,
      f: true,
      flag1: true,
      flag2: true,
      max: 2,
      max1: 2,
      max2: 2,
      dialog: false,
      candidateNoList: "",
      reservationNoList: "",
      number: "",
      fontStyle: "",
      year: "",
      str: "",
      name: 0,
      objectId: "",
      config: "",
      doc_data: "",
      allStr: "",
      isShowtab:false,
      hfxsc:'',
      bmhq:'',
      opt:[],
      active:0
    };
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    zwfile: {
      type: Array,
      default: []
    },
    doc_xinxi: {
      type: Array,
      default: []
    },
    oa_comment: {
      type: Array,
      default: []
    },
    receive_note: {
      type: Array,
      default: () => []
    },
    submit_note: {
      type: Array,
      default: () => []
    },
    zhengXunOpinion: {
      type: Array,
      default: () => []
    },
    feedBackOpinion: {
      type: Array,
      default: () => []
    },
    mobileLeaderOpinion: {
      type: Array,
      default: () => []
    },
  },
  computed: {
    showTab(){
      this.$parent.tableList.length>1?this.isShowtab = true:this.isShowtab = false
      return this.isShowtab
    },
    attachment() {
      return this.zwfile.some(f => f.file_category == "attachment");
    },
    relation() {
      return this.zwfile.some(f => f.file_category == "relation");
    },
    doctype(){
      return this.router.doctype
    },
    isHfxsc(){
      return this.$parent.he_fa_xing_shen_cha
    },
    isHqbm(){
      return this.$parent.hui_qian_bu_men
    },
    // 意见数据视图
    showOptions(){
      this.opt = [{
        id:1,
        title:'领导意见',
        model:'mobileLeaderOpinion',
        lengths:this.mobileLeaderOpinion.length,
        flagVal:true
      },{
        id:2,
        title:'会签意见',
        model:'feedBackOpinion',
        lengths:this.feedBackOpinion.length,
        flagVal:true
      },{
        id:2,
        title:'审批意见',
        model:'oa_comment',
        lengths:this.oa_comment.length,
        flagVal:true
      }]
      return this.opt
    }
  },
  mounted() {
    this.config = this.$parent.flowConfig.numberType;
    this.doc_data = this.$parent.doc_data;
  },
  methods: {
    evalFun(a){
      let temp = ''
      temp = a
      // 解析字符串中的变量
      return eval(temp)
    },
    dbshow(_arg = 'oa_comment'){
      if(_arg!='mobileLeaderOpinion'){
        return this[_arg].slice(0, 2);
      }
      return this[_arg]
    },
    tabCilck(item) {
      this.$parent.getTabdata(item)
    },
    cancel() {
    },
    selected(item) {
      this.objectId = item.objectId;
      this.fontStyle = item.fontStyle;
      if(!item.year){
        this.year = ''
      }else{
        this.year = "〔" + item.year + "〕";
      }
      this.number = item.serialNo;
      this.unit = item.unit;
      var str = item.curFullNumber.split("（")[1];
      if (str == undefined) {
        this.str = item.unit;
      } else {
        this.str = item.unit + "（" + str;
      }
    },
    validateNoApi() {
      return new Promise((resolve, reject) => {
        let p = {
          numberId: this.objectId,
          serialNo: this.number,
          numberVersion:'version2'
        };
        validateNo(p).then(res => {
          this.isTrue = res.data.state;
          // this.$Toast(res.data.msg);
          this.allStr = this.fontStyle + this.year + this.number + this.str;
          resolve(this.allStr)
        });
      })
    },
    getData() {     
      this.getCandidateNoApi();      
      // this.dialog = true;
    },
    onClick(name, title) {
      if (name != this.name) {
        this.fontStyle = "";
        this.year = "";
        this.number = "";
        this.unit = "";
        this.str = "";
      }
    },
    async confirm() {  
      await this.validateNoApi()    
      //收文参数
      var swparams = {
        service_table: this.router.serviceTable,
        query_table: "sw_oa_incoming_data",
        data: {
          object_id: this.router.documentId,
          number_id: this.objectId,
          shou_wen_zi_hao: this.number,
          // "shou_wen_zi_hao":'〔'+ this.year+'〕',
          old_number_id: this.doc_data.number_id,
          old_shou_wen_zi_hao: this.doc_data.shou_wen_zi_hao,
          drafter_id: this.doc_data.drafter_id,
          shou_wen_dai_zi: this.fontStyle,
          shou_wen_bian_hao: this.allStr
        },
        not_table:{
          zhong_lei:''
        }
      };
      // 发文参数
      var fwparams = {
        service_table: this.router.serviceTable,
        query_table: "fw_oa_outgoing_data",
        data: {
          object_id: this.router.documentId,
          number_id: this.objectId,
          fa_wen_zi_hao: this.number,
          old_number_id: this.doc_data.number_id,
          old_fa_wen_zi_hao: this.doc_data.fa_wen_zi_hao,
          drafter_id: this.doc_data.drafter_id,
          fa_wen_dai_zi: this.fontStyle,
          fa_wen_bian_hao: this.allStr
        },
        not_table:{
          zhong_lei:''
        }
      };
      let p = "";
      if (this.router.queryTable.indexOf("incoming") > -1) {
        p = swparams;
      } else {
        p = fwparams;
      }
      let self = this
      await savedoc({
        docjson: JSON.stringify(p),
        numberVersion:'version2'
      }).then(res => {
        if (res.code == 20000) {
          this.$Toast({ type: "success", message: "提交成功" });
          this.$parent.getTabledata();
        } else {
          this.$Toast({ type: "success", message: "提交失败" });
        }
      });
    },
    getCandidateNoApi() {
      this.dialog = true
      let p = {
        postIds: this.state.userInfo.user.postIds.join(","),
        departId: this.state.userInfo.user.deptId,
        // numberType: this.$parent.flowConfig.numberType,
        draftDepartName: "",
        formId:this.router.formId,
        numberVersion:'version2',
        // wenzhongCode:''
        // wenzhongCode:
        wenzhongCode:this.router.doctype=="incoming"?' ': this.$parent.doc_data.wen_zhong===null?this.$parent.doc_data.wen_zhong = ' ':this.$parent.doc_data.wen_zhong
      };
      getCandidateNo({
        params:p
      }).then(res => {
        this.candidateNoList = res.data.candidateNoList;
        this.reservationNoList = res.data.reservationNoList;
      });
    },
    fold(j) {
      j.flagVal = !j.flagVal;
    },
    // 文件预览
    saveFile(e) {
      let msg = ''
      this.state.userInfo.user.officePhone === null?msg = '':msg = this.state.userInfo.user.officePhone
      if(window.master == 'iosAndroid'){
        let userinfo = this.state.userInfo.user.userName+msg
        let url = viewUrl+'/preview/onlinePreview'+'?fileId='+e.object_id+'&watermarkText='+userinfo
        let index = e.real_name.lastIndexOf('.')
        const fileType = e.real_name.substring(index+1,e.real_name.length)//截取文件类型
        let p = {
          watermarkText:userinfo,
          url:url,
          fileType:fileType,
          fileSzie:e.file_size
        }
        // 原生端跳转
        if(window.isTypePhone == 'Android'){				
          railsMobilePlatform.showPdfFile(JSON.stringify(p))
        }else{
          window.webkit.messageHandlers.showPdfFile.postMessage(JSON.stringify(p))
        }
      }else if(window.master == 'H5'){
        // H5跳转
        this.$router.push({
          name: "pdfView",
          params: {
            id: e.object_id
          }
        });
      }
    },
    // 流程跟踪
    getflow() { 
      if(window.master == 'iosAndroid'){
        let url = viewUrl + "/document/getInstanceDetail?instanceId=" + this.router.instanceId + "&isMobile=true"+'&name='+this.router.biaoTi
        if(window.isTypePhone == 'Android'){
          railsMobilePlatform.showTraceView(url)
        }else{
          window.webkit.messageHandlers.showTraceView.postMessage(url)
        }
      }else if(window.master == 'H5'){
        this.$router.push({
          name: "ProcessView",
          params: {
            instanceId: this.router.instanceId,
            biaoTi: this.router.biaoTi
          }
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
#textarea {
  width: 100%;
  height: 130px;
  border: 1px solid rgb(241, 241, 241);
}
/deep/ .van-tabs__line{
  background-color: rgb(30, 108, 254);
}
.yijian-content {
  position: relative;
}
.yijian-content .textarea-success {
  position: absolute;
  bottom: 10px;
  right: 10px;
  color: rgb(30, 108, 254);
}
.main {
  /* font-size: 18px; */
  padding: 0 6px;
  /* height: 100%; */
}

p {
  text-align: left;
}

.row {
  text-align: left;
  margin-bottom: 6px;
}

.linebold {
  border-bottom: 3px solid rgb(238, 238, 238);
  text-align: left;
}

.liuc {
  color: rgb(30, 108, 254);
  display: flex;
  justify-content: space-between;
}

.height {
  line-height: 40px;
  text-align: left;
  font-weight: bold
}

.line {
  border-bottom: 2px solid rgb(238, 238, 238);
  text-align: left;
}

.file {
  color: rgb(30, 108, 254);
  font-weight: normal;
}

.time {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  align-items: baseline;
  color: gray;
}
.fontBlod{
  font-weight: bold;
}
footer .btn {
  font-size: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex: 1;
}

.btn button {
  border-radius: 7px;
  flex: 1;
  min-width: 40%;
  display: none;
  height: 40px;
  margin: 0px 4px 8px 4px;
  max-width: 100%;
}
.van-icon{
  top: 12px;
}

.option {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.yijian {
  padding: 0 6px;
}

.group {
  padding: 0 16px;
  font-size: 16px;
}

.van-radio {
  margin-top: 8px;
}

.left {
  text-align: left;
  padding: 3px 15px;
}
.tab1 {
  height: 120px;
  overflow-y: auto;
}
.inputNum {
  width: 22%;
  height: 20px;
  border: 1px solid black;
}
.bottominp {
  width: 100%;
  text-align: right;
  position: absolute;
  right: 20px;
  bottom: 60px;
}
.textsp {
  margin: 0 auto;
  padding: 6px;
  width: 95%;
  height: 100px;
  border: 1px solid #999999;
}
.fileHeight {
  max-height: 130px;
  overflow-y: auto;
}
.van-dialog .van-tab{
  font-size: 18px;
}
.noneLine:last-child{
  border-bottom: none;
}
</style>
