<template>
  <div class="main">
    <!-- mobileLeaderOpinion -->

    <list
      :loading="loading"
      :doc_xinxi="doc_xinxi"
      :zwfile="zwfile"
      :oa_comment="oa_comment"
      :receive_note="receive_note"
      :submit_note="submit_note"
      :zhengXunOpinion="zhengXunOpinion"
      :feedBackOpinion="feedBackOpinion"
      :mobileLeaderOpinion="mobileLeaderOpinion"
    ></list>

    <div class="yijian">
      <div class="height">填写意见</div>

      <div class="yijian-content">
        <div>
          <textarea
            name=""
            id="textarea"
            @blur="blurText"
            v-model="textarea"
            placeholder="请输入填写意见"
          >
          </textarea>

          <!-- <div @click="success" class="textarea-success">常用意见</div> -->

          <van-popup
            v-model="showSuccess"
            position="bottom"
            :style="{ height: '50%' }"
          >
            <van-picker
              class="fonts"
              show-toolbar
              :columns="columnsSuccess"
              @confirm="onConfirm"
              @cancel="onCancel"
            />
          </van-popup>
        </div>

        <!-- 新加代码 领导特殊页面 -->

        <div v-if="!isLingdao">
          <div class="option">
            <van-button
              type="info"
              class="lingdaoteshubtn"
              @click="dialogRenyuan"
            >
              人员选择
            </van-button>

            <div class="option_right">
              <div>
                <van-tag
                  closeable
                  size="large"
                  type="primary"
                  @close="closerenyuanBanzi"
                  class="textareaLingdaotag"
                  v-if="renYuanData.renruanxuanzeValueBanzi"
                >
                  {{ renYuanData.renruanxuanzeValueBanzi }}
                </van-tag>
              </div>

              <div>
                <van-tag
                  closeable
                  size="large"
                  type="primary"
                  @close="closerenyuan"
                  class="textareaLingdaotag"
                  v-if="renYuanData.renruanxuanzeValue"
                >
                  {{ renYuanData.renruanxuanzeValue }}
                </van-tag>
              </div>
            </div>
          </div>

          <div class="option">
            <van-button
              type="info"
              class="lingdaoteshubtn"
              @click="dialogZhuban"
            >
              主办部门
            </van-button>

            <div class="option_right">
              <div>
                <van-tag
                  closeable
                  size="large"
                  type="primary"
                  @close="closezhuban"
                  class="textareaLingdaotag"
                  v-if="tree.zhubanbumenValue"
                >
                  {{ tree.zhubanbumenValue }}
                </van-tag>
              </div>
            </div>
          </div>

          <div class="option">
            <van-button
              type="info"
              class="lingdaoteshubtn"
              @click="dialogXieban"
            >
              协办部门
            </van-button>

            <div class="option_right">
              <div>
                <van-tag
                  closeable
                  size="large"
                  type="primary"
                  @close="closexieban"
                  class="textareaLingdaotag"
                  v-if="tree.xiebanbumenValue"
                >
                  {{ tree.xiebanbumenValue }}
                </van-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 新加代码 领导特殊页面 -->
      </div>

      <!-- <button @click="end($event)">会签反馈</button> -->
    </div>

    <footer>
      <van-skeleton title :row="2" :loading="btloading" />

      <div class="btn">
        <van-button
          type="info"
          loading-text="加载中..."
          v-showBtn="{ name: 'ti_jiao', data: btnData }"
          @click.stop="TiJiao"
          >提交</van-button
        >

        <van-button
          type="info"
          class="zxyj"
          loading-text="加载中..."
          v-showBtn="{ name: 'zheng_xun_yi_jian', data: btnData }"
          @click="zhiXi('zheng_xun_yi_jian')"
          >征询意见</van-button
        >

        <van-button
          type="danger"
          loading-text="加载中..."
          v-showBtn="{ name: 'hui_qian_fan_kui', data: btnData }"
          @click="huiqian()"
          >会签反馈</van-button
        >

        <van-button
          type="danger"
          loading-text="加载中..."
          v-showBtn="{ name: 'jie_shu', data: btnData }"
          @click="end($event)"
          >结束</van-button
        >

        <van-button
          type="danger"
          loading-text="加载中..."
          v-showBtn="{ name: 'tui_hui', data: btnData }"
          @click="sendBack"
          >退回</van-button
        >

        <van-button
          type="info"
          loading-text="加载中..."
          v-showBtn="{ name: 'zhi_xi', data: btnData }"
          @click="zhiXi('zhi_xi')"
          >知会</van-button
        >
      </div>
    </footer>

    <van-dialog
      v-model="dialog"
      title="选择人员"
      show-cancel-button
      @confirm="confirm"
      @cancel="cancel"
    >
      <van-radio-group v-model="name" class="group">
        <div v-for="(item, index) in radio" :key="index">
          <van-radio
            :disabled="item.disabled"
            :name="index"
            @click="change(item)"
            >{{ item.nodeName
            }}<span style="color: red" v-if="item.disabled">{{
              item.reason
            }}</span></van-radio
          >
        </div>
      </van-radio-group>
    </van-dialog>

    <!-- 新加三个弹出框 -->

    <van-dialog
      v-model="popTemp.renyuancontent"
      :title="xuanzetitle"
      show-cancel-button
      @confirm="confirmLingdao"
      @cancel="cancelLingdao"
      @close="beforecloseLingdao"
      class="tanchukuang"
    >
      <div>
        <van-checkbox-group v-model="renYuanData.checkboxGroupRenyuanBanzi">
          <van-checkbox
            :name="renYuanData.banziListRenyuan"
            shape="square"
            class="dialog"
            >班子成员</van-checkbox
          >
        </van-checkbox-group>

        <van-checkbox-group v-model="renYuanData.checkboxGroupRenyuan">
          <van-checkbox
            :name="item.userName"
            shape="square"
            class="dialog"
            v-for="(item, index) in renYuanData.cengjiListRenyuan"
            :key="index"
            >{{ item.userName }}</van-checkbox
          >
        </van-checkbox-group>
      </div>
    </van-dialog>

    <van-dialog
      v-model="popTemp.zhubancontent"
      :title="xuanzetitle"
      show-cancel-button
      @confirm="confirmZhuban"
      @cancel="cancelZhuban"
      @close="beforecloseZhuban"
      class="tanchukuang"
    >
      <div>
        <el-tree
          :data="tree.zhubantree"
          ref="zhubantrees"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[1]"
          :props="defaultProps"
          @check-change="handleNodeClickzhuban"
          @node-click="commitNodeClickzhubanxieban"
        ></el-tree>
      </div>
    </van-dialog>

    <van-dialog
      v-model="popTemp.xiebancontent"
      :title="xuanzetitle"
      show-cancel-button
      @confirm="confirmXieban"
      @cancel="cancelXieban"
      @close="beforecloseXieban"
      class="tanchukuang"
    >
      <div>
        <el-tree
          :data="tree.xiebantree"
          :props="defaultProps"
          node-key="id"
          :default-expanded-keys="[1]"
          @check-change="handleNodeClickxieban"
          @node-click="commitNodeClickzhubanxieban"
          ref="xiebantrees"
          show-checkbox
        ></el-tree>
      </div>
    </van-dialog>

    <!-- 新加三个弹出框 -->
  </div>
</template>

<script>
import {
  saveOpinion,
  nextNodeUserTree,
  getByWorkitemId,
  carsoaSubmit,
  getoftenComments,
  getWorkItemToBack,
  findZhuBanlist,
  findByDeptId,
} from "@/api/api";

import list from "@/pages/common/list.vue";

import { minxin } from "@/common/mixins/getList.js";

import { mapState } from "vuex";

export default {
  mixins: [minxin],

  data() {
    return {
      defaultProps: {
        children: "children",

        label: "title",
      },

      personData: [],

      xuanzetitle: "", //弹出框标题

      popTemp: {
        dialogLingdao: false, //人员选择主办部门协办部门弹出层

        renyuancontent: false, //控制人员弹出层内容

        zhubancontent: false, //控制主办部门弹出层内容

        xiebancontent: false, //控制协办部门弹出层内容
      },

      renYuanData: {
        checkboxGroupRenyuanBanzi: [],

        tempbanzixuanzhong: "",

        banzixuanzhong: "",

        renruanxuanzeValueBanzi: "",

        cengjiListRenyuan: "", //人员选择弹出层单选框数据层级

        banziListRenyuan: "", //人员选择弹出层单选框数据班子

        checkboxGroupRenyuan: [], //人员选择弹出层复选框数据

        renruanxuanzeValue: "", //人员选择弹出层单选框点击确定后的数据
      },

      tree: {
        zhubantree: [], //主办部门树的数据

        xiebantree: [], //协办部门树的数据

        zhubantrees: [], //主办选中的数据 用于清空

        xiebantrees: [], //协办选中的数据 用于清空

        zhubanbumenValue: "", //主办部门弹出层单选框点击确定后的数据

        xiebanbumenValue: "", //协办部门弹出层单选框点击确定后的数据
      },

      showSuccess: false, //意见弹出层

      isTrue: false,

      columnsSuccess: [], //弹出层数据

      dialog: false,

      radio: [],

      name: 0,

      peopleData: [],

      textarea: "",

      textareaid: "",

      textfildjson: "",

      workitemType: "",

      backP: {
        userCode: "",

        workItemId: "",

        commentText: "",

        documentId: "",

        opinionId: "",

        workitemType: "",
      },

      // 提交和结束的接口参数

      endP: {
        userId: "",

        instanceId: "",

        documentId: "",

        sign: "",

        nextActivityCode: "",

        participant: "",

        workItemId: "",

        serviceTable: "",

        queryTable: "",

        opinionId: "",

        workFlowCode: "",

        finishAccessPoint: "mobile",

        readEnd: "",
      },

      saveOpinion: {
        documentId: "",

        objectId: "",

        instanceId: "",

        workitemId: "",

        activityCode: "",

        displayName: "",

        approvalUserId: "",

        approvalOpinion: "",

        approvalOpinionInput: "",

        waitDoOrRead: "",

        approvalOpinionImgId: "",

        counterSignDept: "",

        counterSignDeptId: "",

        approvalUserName: "",

        approvalDepartment: "",

        approvalDepartmentInfo: "",

        approvalDepartmentId: "",

        approvalPosition: "",

        departLevel: "",

        departSortNumber: "",

        departPostSortNumber: "",

        attachmentFileId: "",

        attachmentFileName: "",

        commentBath: "",

        optionalFeedbackComment: "",

        textField: "",

        textFieldJson: "",

        state: "0",

        mobileOrPc: "mobile",
      },

      isBlurText: false, //是否执行了意见,

      dealdata: {},
    };
  },

  computed: {
    ...mapState(["optionYj", "cacheOption"]),

    endParams() {
      this.endP.userId = this.state.userInfo.userId;

      this.endP.instanceId = this.router.instanceId;

      this.endP.documentId = this.router.documentId;

      this.endP.queryTable = this.router.queryTable;

      this.endP.workitemType = this.workitemType;

      this.endP.workFlowCode = this.router.workflowCode;

      this.endP.serviceTable = this.router.serviceTable;

      this.endP.workItemId = this.router.workitemId;

      this.endP.nextActivityCode = "Activity4";

      return this.endP;
    },

    userInfos() {
      return this.$store.state.userInfo;
    },

    Lingdaotextarea() {
      return `${this.renYuanData.renruanxuanzeValueBanzi}${this.renYuanData.renruanxuanzeValue}${this.tree.zhubanbumenValue}${this.tree.xiebanbumenValue}`;
    }, //拼接完成的意见数据
  },

  components: { list },

  mounted() {
    //这里写才能回显

    this.getTrees();

    this.getByWorkitemIdApi();

    this.textarea = this.cacheOption;

    this.apiGetoftenComments();
  },

  watch: {
    optionYj(newVal) {
      if (newVal.yj) {
        this.textarea = newVal.yj || newVal;
      }
    },
  },

  methods: {
    //新加方法

    getTrees() {
      //调用新增主办部门接口

      findByDeptId({ params: { companyId: "" } }).then((res) => {
        let trees = JSON.parse(
          JSON.stringify(res.data)

            .replace(/deptName/g, "title")

            .replace(/childList/g, "children")
        );

        trees[0].id = 1;

        this.tree.zhubantree = trees;

        this.tree.xiebantree = trees;
      });
    },

    handleNodeClickzhuban(data) {
      //选择提交点击list事件 所有的数据存入arr数组

      let res = this.$refs.zhubantrees.getCheckedNodes();

      console.log(res);

      let arr = [];

      res.forEach((item) => {
        arr.push(item);
      });

      this.tree.zhubantreesTemp = arr;
    },

    handleNodeClickxieban(data) {
      //选择提交点击list事件 所有的数据存入arr数组

      let res = this.$refs.xiebantrees.getCheckedNodes();

      let arr = [];

      res.forEach((item) => {
        arr.push(item);
      });

      this.tree.xiebantreesTemp = arr;
    },

    commitNodeClickzhubanxieban(data1, data2, data3) {
      //提交领导点击list事件

      if (!data2.childNodes.length) {
        data2.checked = !data2.checked;
      }

      // this.leaderLists = data;
    },

    //点新增人员选择

    dialogRenyuan() {
      this.popTemp.renyuancontent = true;

      this.xuanzetitle = "人员选择";

      //调用获取人员接口

      findZhuBanlist({ params: { dutyCode: "" } }).then((res) => {
        let myname = this.$store.state.userInfo.user.userName;

        //层级列表去重自己

        let cengjiListRenyuan = res.data.cengji;

        let tempcengji = cengjiListRenyuan.filter((item) => {
          return item.userName != myname;
        });

        this.renYuanData.cengjiListRenyuan = tempcengji;

        let tempbanzixuanzhong = res.data.banzi;

        let tempbanzi = tempbanzixuanzhong.filter((item) => {
          return item.userName != myname;
        });

        this.renYuanData.tempbanzixuanzhong = tempbanzi;

        this.renYuanData.banziListRenyuan = true;
      });
    },

    //点新增主办部门

    dialogZhuban() {
      this.popTemp.zhubancontent = true;

      this.xuanzetitle = "主办部门";
    },

    //点协办部门

    dialogXieban() {
      this.popTemp.xiebancontent = true;

      this.xuanzetitle = "协办部门";
    },

    //确定

    confirmLingdao(value, index) {
      if (this.renYuanData.checkboxGroupRenyuanBanzi.length) {
        // ppppppppppp

        if (this.renYuanData.checkboxGroupRenyuanBanzi[0] == true) {
          this.renYuanData.banzixuanzhong = this.renYuanData.tempbanzixuanzhong;
        }

        this.renYuanData.renruanxuanzeValueBanzi = `请班子成员阅`;
      }

      if (this.renYuanData.checkboxGroupRenyuan.length) {
        let that = this;

        let newarr = [];

        that.renYuanData.checkboxGroupRenyuan.forEach((itemtwo) => {
          let arr = that.renYuanData.cengjiListRenyuan.filter((item) => {
            return item.userName == itemtwo;
          });

          newarr.push(arr[0]);
        });

        //比自己排序大的阅处  小的阅视

        let mysortNumber = this.$store.state.userInfo.user.sortNumber;

        let bigsortNumber = newarr.filter((item) => {
          return item.sortNumber < mysortNumber;
        });

        let smallsortNumber = newarr.filter((item) => {
          return item.sortNumber > mysortNumber;
        });

        let bigsortNumberArr = [];

        let smallsortNumberArr = [];

        let bigsortNumberArrValue = ""; //展示的字

        let smallsortNumberArrValue = ""; //展示的字

        if (bigsortNumber.length) {
          bigsortNumberArr = bigsortNumber.map((item) => {
            return item.userName;
          });
        }

        if (smallsortNumber.length) {
          smallsortNumberArr = smallsortNumber.map((item) => {
            return item.userName;
          });
        }

        if (bigsortNumberArr.length) {
          bigsortNumberArrValue = `请${bigsortNumberArr.toString()}阅视`;
        }

        if (smallsortNumberArr.length) {
          smallsortNumberArrValue = `请${smallsortNumberArr.toString()}阅处`;
        }

        this.renYuanData.renruanxuanzeValue = `${bigsortNumberArrValue} ${smallsortNumberArrValue}`;

        this.personData = newarr;
      }

      this.cancelLingdao();

      this.blurText();
    },

    confirmZhuban(value, index) {
      if (this.popTemp.zhubancontent) {
        //过滤出不带children的数组

        this.tree.zhubantrees = this.tree.zhubantreesTemp.filter((item) => {
          return item.children == undefined;
        });

        if (this.tree.zhubantrees.length > 1) {
          this.$toast("只能选择一个主办单位");

          //这里清空主办部门数据

          this.tree.zhubantrees = [];

          return;
        }
      }

      if (this.tree.zhubantrees.length) {
        let newzhubantrees = this.tree.zhubantrees.map((item) => {
          return item.title;
        });

        this.tree.zhubanbumenValue = `请${newzhubantrees.toString()}部门牵头组织`;
      }

      this.cancelZhuban();

      this.blurText();
    },

    confirmXieban(value, index) {
      if (this.popTemp.xiebancontent) {
        this.tree.xiebantrees = this.tree.xiebantreesTemp.filter((item) => {
          return item.children == undefined;
        });
      }

      if (this.tree.xiebantrees.length) {
        let newxiebantrees = this.tree.xiebantrees.map((item) => {
          return item.title;
        });

        this.tree.xiebanbumenValue = `请${newxiebantrees.toString()}办理`;
      }

      this.cancelXieban();

      this.blurText();
    },

    //取消

    cancelLingdao() {
      this.beforecloseLingdao();
    },

    cancelZhuban() {
      this.beforecloseZhuban();
    },

    cancelXieban() {
      this.beforecloseXieban();
    },

    //关闭弹框的回调  关闭控制显示的变量  避免删除之后再点协办或主办部门的bug

    beforecloseLingdao() {
      this.popTemp.renyuancontent = false;
    },

    beforecloseZhuban() {
      this.popTemp.zhubancontent = false;
    },

    beforecloseXieban() {
      this.popTemp.xiebancontent = false;
    },

    closerenyuanBanzi() {
      this.renYuanData.renruanxuanzeValueBanzi = "";

      this.renYuanData.checkboxGroupRenyuanBanzi = [];

      this.blurText();
    },

    //删除标签

    closerenyuan() {
      this.renYuanData.renruanxuanzeValue = "";

      this.renYuanData.checkboxGroupRenyuan = [];

      this.blurText();
    },

    closezhuban() {
      this.tree.zhubanbumenValue = "";

      this.tree.zhubantrees = [];

      this.blurText();
    },

    closexieban() {
      this.tree.xiebanbumenValue = "";

      this.tree.xiebantrees = [];

      this.blurText();
    },

    //新加方法

    //获取常用意见

    apiGetoftenComments() {
      const params = {
        pageSize: 10,

        pageNum: 1,

        userId: this.state.userInfo.userId,
      };

      getoftenComments({
        params: params,
      }).then((res) => {
        if (res.code == 20000) {
          //成功关注改变状态

          res.data.forEach((item) => {
            this.columnsSuccess.push(item.oftenComments);
          });
        }
      });
    },

    sendBack() {
      this.$Dialog

        .confirm({
          title: "标题",

          message: "请确定是否要退回？",
        })

        .then(() => {
          this.getWorkItemToBackApi();
        })

        .catch(() => {
          // on cancel
        });
    },

    async getWorkItemToBackApi() {
      if (this.isBlurText == false) {
        await this.blurText();
      }

      this.backP.userCode = this.state.userInfo.userId;

      this.backP.workItemId = this.router.workitemId;

      this.backP.documentId = this.router.documentId;

      // this.backP.opinionId = this.$store.state.optionYj.id;

      this.backP.workitemType = this.workitemType;

      this.backP.commentText = "";

      await getWorkItemToBack(this.backP).then((res) => {
        if (res.code == 20000) {
          this.$Toast({ type: "success", message: "退回成功" });

          setTimeout(() => {
            window.history.back(-1);
          }, 550);
        } else {
        }
      });
    },

    blurText() {
      if (this.textarea) {
        this.$store.commit("set_cacheOption", this.textarea);
      }

      this.isBlurText = true;

      // 延迟执行，先出发点击事件，后失焦

      // setTimeout(() => {

      let p = this.router;

      let user = this.state.userInfo.user;

      let basicDept = this.state.basicDept;

      this.saveOpinion.documentId = p.documentId;

      this.saveOpinion.workitemId = p.workitemId;

      this.saveOpinion.approvalUserName = user.userName;

      this.saveOpinion.approvalDepartmentInfo = user.departName;

      this.saveOpinion.approvalDepartment = user.dept.deptName;

      this.saveOpinion.departPostSortNumber = user.sortNumber;

      this.saveOpinion.instanceId = p.instanceId;

      this.saveOpinion.deptName = user.dept.deptName;

      this.saveOpinion.approvalUserId = this.userInfos.userId;

      this.saveOpinion.activityCode = p.activityCode;

      this.saveOpinion.approvalOpinionInput =
        this.isLingdao == false
          ? this.textarea + this.Lingdaotextarea
          : this.textarea;

      this.saveOpinion.waitDoOrRead = "ToDo";

      this.saveOpinion.textFieldJson = this.textfildjson;

      this.saveOpinion.departSortNumber = basicDept.sortNumber;

      this.saveOpinion.approvalDepartmentId = basicDept.objectId;

      // this.saveOpinion.departLevel = basicDept.departLevel

      basicDept.deptLevel === null
        ? (this.saveOpinion.departLevel = 1)
        : (this.saveOpinion.departLevel = basicDept.departLevel);

      if (this.optionYj.id) {
        this.saveOpinion.objectId = this.optionYj.id;
      }

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          saveOpinion(this.saveOpinion).then((res) => {
            let a = {
              yj: res.data.approvalOpinionInput,

              id: res.data.objectId,
            };

            // 提前赋值防止赋值失败

            this.endP.opinionId = res.data.objectId;

            this.backP.opinionId = res.data.objectId;

            // 也可以注释掉

            this.$store.commit("set_yijian", a);

            resolve();
          }, 100);
        });
      });

      // }, 100);
    },

    getByWorkitemIdApi() {
      getByWorkitemId({
        params: {
          type: "ToDo",

          workitemId: this.router.workitemId,
        },
      }).then((res) => {
        this.textfildjson = res.data.textField;

        this.workitemType = res.data.workitemType;

        this.saveOpinion.displayName = res.data.displayName;

        window.displayName = res.data.displayName;

        //新加参数

        window.activityCode = res.data.activityCode;
      });
    },

    confirm() {
      //回到最初的起点

      this.peopleData = this.radio[this.name];

      this.name = 0;

      this.$router.push({
        path: "/DocumentToDo/selectPeople/submit",

        query: {
          peopData: this.peopleData,

          docData: this.router,

          opinionId: this.endP.opinionId,
        },
      });
    },

    zhiXi(e) {
      this.router.zhixiType = e;

      this.$router.push({
        path: "/DocumentToDo/selectPeople/zhixi",

        query: this.router,
      });
    },

    cancel() {
      //回到最初的起点

      this.name = 0;
    },

    huiqian() {
      this.$router.push({
        name: "feedback",

        params: {
          result: this.oa_comment,

          query: this.router,

          endp: this.endParams,
        },
      });
    },

    change(e) {
      this.peopleData = e;
    },

    async TiJiao() {
      if (!this.isSubmit) {
        this.$Toast("请检查是否已编号");

        return;
      }

      if (!this.Lingdaotextarea && !this.isLingdao) {
        this.$Toast("请选择人员");

        return;
      }

      if (this.isBlurText == false || !this.isLingdao) {
        await this.blurText();
      }

      // await this.blurText()

      if (this.renYuanData.banzixuanzhong.length && this.personData.length) {
        // 数组对象去重人员数据

        const a = this.renYuanData.banzixuanzhong.concat(this.personData);

        var result = [];

        var obj = {};

        for (var i = 0; i < a.length; i++) {
          if (!obj[a[i].userName]) {
            result.push(a[i]);

            obj[a[i].userName] = true;
          }
        }

        this.personData = result;
      }

      // 全是业务代码！！！！！！！！！！！！！！！！！！！！！！！！

      if (this.$store.state.optionYj.hasOwnProperty("id")) {
        this.endP.opinionId = this.$store.state.optionYj.id;

        this.backP.opinionId = this.$store.state.optionYj.id;
      }

      await nextNodeUserTree({
        params: {
          workItemId: this.router.workitemId,

          userId: this.state.userInfo.userId,

          departId: this.state.userInfo.user.deptId,
        },
      }).then((res) => {
        let name = "";

        this.radio = res.data;

        this.duoxuan = res.duoxuan.split(",");

        this.endP.userId = this.state.userInfo.userId;

        this.endP.instanceId = this.router.instanceId;

        this.endP.documentId = this.router.documentId;

        this.endP.queryTable = this.router.queryTable;

        this.endP.participant = res.directSubmit;

        this.endP.workitemType = this.workitemType;

        this.endP.workFlowCode = this.router.workflowCode;

        this.endP.serviceTable = this.router.serviceTable;

        this.endP.workItemId = this.router.workitemId;

        if (res.directSubmit != "" && res.data[0].nodeCode) {
          this.dialog = false;

          const nextcode = res.data[0].nodeCode;

          this.endP.nextActivityCode = nextcode;

          res.data[0].data.forEach((item) => {
            item.type == "user" ? (name = item.name) : "";
          });

          this.$Dialog

            .confirm({
              title: "标题",

              message: "确定要提交到(" + name + ")吗？",
            })

            .then(() => {
              // on confirm

              this.carsoaApi();
            })

            .catch(() => {
              // on cancel
            });
        } else if (!this.isLingdao) {
          let that = this;

          var p = {};

          // 44

          this.dealP(this.renYuanData.banzixuanzhong, 0, 2);

          this.dealP(this.personData, 0, 1);

          this.dealP(this.tree.zhubantrees, 1, 2);

          this.dealP(this.tree.xiebantrees, 2, 2);

          this.carsoaApi();
        } else {
          this.dialog = true;
        }
      });
    },

    // 人员参数数据处理

    dealP(data, index, id) {
      if (data.length == 0) return;

      var strId = "";

      this.strActive = [];

      this.dealdata[this.duoxuan[index]] = [];

      let arrId = [],
        arrName = [];

      data.map((item, index) => {
        arrId.push(item.userId || item.objectId);

        arrName.push(item.name || item.userName);
      });

      this.dealdata[this.duoxuan[index]].push({
        id: arrId.join(","),

        boci: id,

        sign: "",

        name: arrName.join(","),
      });

      strId += arrId.join(",");

      this.strActive.push(this.duoxuan[index]);

      this.endP.nextActivityCode = Array.from(new Set(this.strActive)).join(
        ","
      );

      this.endP.batchJson = JSON.stringify(this.dealdata);

      this.endP.participant = strId;
    },

    end(e) {
      this.endP.userId = this.state.userInfo.userId;

      this.endP.instanceId = this.router.instanceId;

      this.endP.documentId = this.router.documentId;

      this.endP.queryTable = this.router.queryTable;

      this.endP.workitemType = this.workitemType;

      this.endP.workFlowCode = this.router.workflowCode;

      this.endP.serviceTable = this.router.serviceTable;

      this.endP.workItemId = this.router.workitemId;

      this.endP.nextActivityCode = "Activity4";

      this.$Dialog

        .confirm({
          title: "标题",

          message: "请确定是否要结束？",
        })

        .then(() => {
          this.carsoaApi();
        })

        .catch(() => {
          // on cancel
        });
    },

    // 提交结束接口

    carsoaApi() {
      carsoaSubmit(this.endP).then((res) => {
        if (res.code == 20000) {
          this.$Toast({ type: "success", message: "提交成功" });

          setTimeout(() => {
            this.endP.participant = "";

            window.history.back(-1);
          }, 750);
        } else {
        }
      });
    },

    success() {
      this.showSuccess = true;
    },

    onConfirm(value, index) {
      this.textarea = value;

      this.showSuccess = false;

      this.blurText();
    },

    onCancel() {
      this.showSuccess = false;
    },
  },
};
</script>

<style scoped>
@import "../common/list.css";

.zxyj {
  background: #ebb563;

  border: #ebb563;

  font-size: 18px;
}

.textareaLingdaotag {
  margin: 5px;
}

.dialog {
  margin: 10px;
}

/deep/ .van-dialog__content {
  overflow: auto !important;

  max-width: 100% !important;

  max-height: 80vh !important;

  margin-top: 10px !important;
}

/deep/ .ivu-tree {
  text-align: left;

  margin: 60px 30px 80px 30px;
}

/deep/ .ivu-tree ul {
  font-size: 18px !important;
}

/deep/ .van-tag--primary {
  background: #d8d8d8 !important;

  color: #848484;
}

.option {
  display: flex;

  justify-content: space-between;

  margin: 10px 0;

  align-items: center;
}

.option_right {
  width: 70%;

  border: 1px solid #e6e6e6;

  min-height: 40px;

  text-align: left;
}

.lingdaoteshubtn {
  width: 25%;

  font-size: 14px;

  border: 15px;

  height: 32px;
}
</style>
