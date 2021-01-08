<template>
    <div class="header">
        <header-title>选择人员</header-title>
        <Tree :data = 'baseData' :render='renderContent' multiple show-checkbox ref="tree" @on-select-change='selectChange' @on-check-change='getCheckedNodes'></Tree>
        <div class="footer">
            <van-button type="info" size="large" class="btn" @click="submit">确定（提交）</van-button>
        </div>
    </div>
</template>
<script>
import {carsoaSubmit} from '@/api/api'
export default {
    data(){
        return{
            baseData:[],
            isMult:true,
            saveOpinion:{			
                userId:'',
                instanceId:'',
                instanceId:'',
                documentId:'',
                serviceTable:'',
                sign:'',
                nextActivityCode:'',
                participant:'',
                workItemId:'',
                readEnd:'',
                isDifferentiate:'',
                queryTable:'',
                opinionId:'',
                workitemType:'',
                workFlowCode:'',
                isSendMessage:0,
                isejdw:'',
                remark:'',
                attachmentCopyType:'',
                finishAccessPoint:'mobile'                             
            },
            seletedPeople:[],
            tempTreeSelect:''               
        }
    },
    computed: {
        tiJiaoP(){
            return this.router.docData
        }
    },
    mounted(){        
        this.toTree(this.router.peopData.data)
        this.router.peopData.isMulti?this.isMult = true:this.isMult = false
    },
    methods:{
        renderContent(h, { root, node, data }){
            return h(
            "span",
            {
            style: {
                display: "inline-block",
                cursor: "pointer",
                color: node.node.selected ? "#2d8cf0" : "black" //根据选中状态设置样式
            },
            on: {
                click: () => {
                    console.log(node,this.$refs.tree.getCheckedAndIndeterminateNodes())
                    node.node.expand = !node.node.expand
                    let allData = this.$refs.tree.getCheckedAndIndeterminateNodes()
                    if(!node.children){
                        node.node.checked = !node.node.checked
                    }
                    allData.forEach((item,index)=>{     
                        console.log(item)   
                        if(node.node.pId == item.id && item.checked){
                            item.checked = false
                            return
                        }
                    })
                }
            }
            },data.title)
        },
        // 设置文字选中
        selectChange(v){
        },
        getCheckedNodes(arr,obj){
            // 设置该节点是否为多选
            if(!this.router.peopData.isMulti){
                // 清空所有已选中的
                arr.forEach(item => {
                    item.checked = false;
                });
                // 只选中最后一次选中的
                obj.checked = true;
            }
            // 存放user的id
            let userid = []
            let username = []
            this.$refs.tree.getCheckedNodes().forEach((item,index)=>{
                userid.push(item.userId || item.id)
                username.push(item.title)
            })
            userid = userid.join(',')           
            username = username.join(',')           
            this.saveOpinion.participant = userid
            this.seletedPeople = username
        
        },
        toTree(data) {
            let that = this
            var data = JSON.parse(JSON.stringify(data).replace(/name/g,"title"));
            // 删除 所有 children,以防止多次调用
            data.forEach(function (item) {
                delete item.children;
            });        
            // 将数据存储为 以 id 为 KEY 的 map 索引数据列
            var map = {};
            data.forEach(function (item) {
                map[item.id] = item;
            });           
            var val = [];
            data.forEach(function (item) {               
                if(item.pId == 0){
                    item.expand = true
                }
                // 会签部门回显
                if(that.router.peopData.sign == "countersign"){
                    window.hui_qian_bu_men_id.map(x=>{
                        if(item.deptId == x){
                            item.checked = true
                        }
                    })
                }
                // 以当前遍历项，的pid,去map对象中找到索引的id
                var parent = map[item.pId];
                // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                if (parent) {                    
                    (parent.children || ( parent.children = [] )).push(item);
                } else {
                    //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
                    val.push(item);
                }
            });
            this.baseData = val         
        },
        submit(){
            this.getCheckedNodes()
            this.$Dialog.confirm({
                title: '标题',
                message: `你确定要提交给（${this.seletedPeople}）吗？`,
            })
            .then(() => {
                this.submitDoc()                
            })
            .catch(() => {
                
            });
        },
        submitDoc(){              
            this.saveOpinion.userId = this.state.userInfo.userId    
            this.saveOpinion.instanceId = this.tiJiaoP.instanceId
            this.saveOpinion.documentId = this.tiJiaoP.documentId
            this.saveOpinion.queryTable = this.tiJiaoP.queryTable
            this.saveOpinion.opinionId = this.router.opinionId
            this.saveOpinion.workitemType = this.tiJiaoP.workitemType
            this.saveOpinion.workFlowCode = this.tiJiaoP.workflowCode
            this.saveOpinion.serviceTable = this.tiJiaoP.serviceTable
            this.saveOpinion.workItemId = this.tiJiaoP.workitemId
            this.saveOpinion.nextActivityCode = this.router.peopData.nodeCode
            this.saveOpinion.sign = this.router.peopData.sign
            carsoaSubmit(this.saveOpinion).then(res=>{
                if(res.code == 20000){
                    this.$Toast({ type: 'success', message: '提交成功' });
                    setTimeout(()=>{
                        window.history.go(-2);
                    },750)
                }else{
                        
                }
            })
        }
    }
}
</script>
<style scoped lang='scss'>
    /deep/ .ivu-tree{
        text-align: left;
        margin:60px 30px 80px 30px;       
    }
    
    /deep/ .ivu-tree ul{
        font-size: 18px !important;
    }
    
    .footer{        
        width: 100%;        
        position: fixed;
        bottom: 0px;
        left: 0;      
        border-radius: 18px;
        background: white
    }
    .btn{
        border-radius: 10px;
    }
    /deep/ .van-button--large{
        width: 90%;
        margin-bottom: 10px;
    }
</style>