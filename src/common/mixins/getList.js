import { getDocumentDeail, getWorkItemOptions } from '@/api/api'
import { data } from 'autoprefixer';
import { mapMutations } from "vuex";
export const minxin = {
    data() {
        return {

            isLingdao: true, //是否是领导账号 新加变量
            listData: {
                objectId: '',
                isDistribute: '',
                serviceTable: '',
                userId: '',
                doctype: '',
                companyId: ''
            },
            btnParams: {
                activityCode: '',
                workflowCode: '',
                requestType: ''
            },
            loading: true,
            btloading: true,
            doc_xinxi: [],
            zwfile: [],
            oa_comment: [],
            btnData: [],
            flowConfig: {},
            doc_data: '',
            receive_note: [],
            zhengXunOpinion: [],
            feedBackOpinion: [],
            submit_note: [],
            tableList: {},
            isSubmit: '',
            hui_qian_bu_men: '',
            he_fa_xing_shen_cha: '',
            mobileLeaderOpinion: [],
            hui_qian_bu_men_id: '',
            rule: ''
        }
    },
    computed: {
        state() {
            return this.$store.state;
        },
        router() {
            return this.$route.query
        },
    },
    mounted() {
        this.$route.name == 'DoucumentAttentionFinish' ? this.getTabledata() : ''
            // 关注，办结，已阅详情不需要按钮展示
        if (this.router.isFinish == 2 || this.router.requestType == "yi_yue" || this.router.requestType == "") return
        this.getBtn()
    },
    methods: {
        ...mapMutations(['changfavoritesTempfalses', 'changfavoritesTemptrues', 'hide']),
        getTabledata() {
            this.listData.userId = this.state.userInfo.userId;
            this.listData.objectId = this.router.documentId || this.router.document_id;
            this.listData.serviceTable = this.router.serviceTable || this.router.service_table;
            this.listData.doctype = this.router.doctype;
            this.listData.rule = this.rule;
            this.listData.companyId = this.state.userInfo.user.companyId;
            // this.listData.objectId = this.router
            try {
                getDocumentDeail({
                    params: this.listData
                }).then(res => {
                    this.tableList = res.data

                    // 默认为零是收文稿纸
                    let index;
                    this.getTabdata(index = 0)
                })
            } catch (error) {
                console.log(error)
            }
        },
        getBtn() {
            this.btnParams.activityCode = this.router.activityCode || this.router.activity_code
            this.btnParams.workflowCode = this.router.workflowCode || this.router.workflow_code
            this.btnParams.requestType = this.router.requestType
            getWorkItemOptions({
                params: this.btnParams
            }).then(res => {
                //新加判断逻辑
                let lingDao = res.data.filter(item => {
                    return item.infoType == 'dian_xuan_yi_jian';
                })
                if (lingDao.length) {
                    this.isLingdao = false;
                }
                //新加判断逻辑
                this.btloading = false
                this.btnData = res.data
                let bianhaoShow = res.data.some(f => f.infoType == 'bian_hao')
                res.data.map(res => {
                    if (res.infoType == 'isXiangXia') {
                        this.rule = res.infoValue.rule
                        return
                    }
                })
                this.$store.commit('get_showbh', bianhaoShow)
                this.getTabledata()


            }).catch(res => {
                console.log(res)
            })
        },
        // 获取原始稿纸等数据
        getTabdata(index = 0) {
            let data = this.tableList[index]

            // 有待修改，尽量在数据模板中加判断，index在原始稿纸的情况下不显示关注
            if (index == 1) {
                this.$store.commit('hide_bianhao', true)
                document.getElementsByClassName('favorites')[0].style.display = 'none'
            } else {
                this.$store.commit('hide_bianhao', false)
                document.getElementsByClassName('favorites')[0].style.display = 'block'
                if (data.isAttention == 'true') {
                    this.changfavoritesTemptrues()
                } else {
                    this.changfavoritesTempfalses()
                }
            }

            this.loading = false
            this.doc_xinxi = data.doc_xinxi
            this.he_fa_xing_shen_cha = data.doc_data.he_fa_xing_shen_cha === null || data.doc_data.he_fa_xing_shen_cha === 0 ? '否' : '是'
            this.hui_qian_bu_men = data.doc_data.hui_qian_bu_men === "" ? '无' : data.doc_data.hui_qian_bu_men
            window.hui_qian_bu_men_id = data.doc_data.hui_qian_bu_men_id.split(",")
            this.isSubmit = data.doc_xinxi.some(f => (f.infoType.indexOf('编号') > -1 && f.infoValue !== ''))
            this.zwfile = data.attachmentList
            if (data.oa_comment) {
                this.oa_comment = data.oa_comment.allOpinion
                this.flowConfig = data.flowConfig

                // 原始稿纸的数据以收文的为主
                this.doc_data = this.tableList[0].doc_data
                if (data.oa_comment.temporaryOpinion && data.oa_comment.temporaryOpinion.length) {
                    let a = {
                        yj: data.oa_comment.temporaryOpinion[0].approvalOpinionInput,
                        id: data.oa_comment.temporaryOpinion[0].objectId
                    }
                    if (this.$store.state.cacheOption) {
                        console.log(this.$store.state.cacheOption)
                        this.$store.commit('set_yijian', this.$store.state.cacheOption)
                    } else {
                        this.$store.commit('set_yijian', a)
                    }

                }
            }
            if (data.receive_note) {
                this.receive_note = data.receive_note
            }
            if (data.submit_note) {
                this.submit_note = data.submit_note
                    // console.log('jj', this.submit_note)
            }
            if (data.oa_comment.zhengXunOpinion) {
                this.zhengXunOpinion = data.oa_comment.zhengXunOpinion
                    // console.log('aa', this.zhengXunOpinion)
            }
            if (data.oa_comment.feedBackOpinion) {
                this.feedBackOpinion = data.oa_comment.feedBackOpinion
                    // console.log('aa', this.zhengXunOpinion)
            }
            if (data.oa_comment.mobileLeaderOpinion) {
                this.mobileLeaderOpinion = data.oa_comment.mobileLeaderOpinion
                    // console.log('aa', this.zhengXunOpinion)
            }
        }
    },
}