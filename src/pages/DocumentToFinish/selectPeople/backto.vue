<template>
    <div class="header">
        <header-title>选择人员</header-title>
        <Tree :data = 'baseData' show-checkbox ref="tree" @on-check-change='getCheckedNodes'></Tree>
        <div class="footer">
            <van-button type="info" size="large" class="btn" @click="submit">确定（提交）</van-button>
        </div>
    </div>
</template>
<script>

import {afterReadingItem,appendItem,getWorkItemToCancel } from '@/api/api'
export default {
    data(){
        return{
            baseData:[],
            zhixiPepole:{
                workItemId:'',
                userCodes:'',
                activityCode:'',
                sign:''
            },
            toP:{
                userCode:'',
                workItemIds:'',
                isActive:0,
                activityType:'',
                documentId:'',
                workItemId:'',             
                isSendMessage:'false'
            },
            typeUserNum:0                 
        }
    },
    computed: {
        tiJiaoP(){
            return this.router.docData
        }
    },
    mounted(){        
        this.toTree(this.router.peopData.data)       
    },
    methods:{        
        // getzhixiPeople(){
        //     afterReadingItem({
        //         params:{
        //             userIds:this.state.userInfo.userId,
        //             tagKey:'bumen'
        //         }
        //     }).then(res=>{
        //         this.baseData = res.data
        //         this.toTree(this.baseData)
        //     })
        // },
        getCheckedNodes(){            
            let that = this
            let a = this.$refs.tree.getCheckedNodes()
            console.log(a)          
            // 存放user的id
            let userid = []
            let username = []
            let workid = ''
            let typeUsers = 0            
            a.forEach((item,index)=>{
                // item.disableCheckbox==false
                if(item.type!="dept" && that.router.type == 'bu_fa' && item.state ==""){                    
                    userid.push(item.id)
                    username.push(item.title)
                }else if(item.type != 'dept' && item.state == 'waiting' &&that.router.type == 'shou_hui'){
                    userid.push(item.workItemId)
                    username.push(item.title)
                    workid = item.workItemId
                    // 计算isActive参数
                    typeUsers++               
                }
            })
            // 用户id，name拼接
            userid = userid.join(',')           
            username = username.join(',')           
            this.zhixiPepole.userCodes = userid                 
            this.toP.workItemIds = userid
            // this.toP.workItemId = workid
            this.seletedPeople = username
            if(this.typeUserNum == typeUsers && that.router.type == 'shou_hui'){
                this.toP.isActive = 1
            }
        },
        toTree(data) {
            var that = this
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
                // 对收回，补发人员进行判断
                if(item.state!='waiting'&&item.type!='dept'&&that.router.type == 'shou_hui'){                    
                    // item.disableCheckbox = true
                    // item.disabled = false
                    // val.push('disabled')
                    
                }else if(item.state=='waiting'&&item.type!='dept'&&that.router.type == 'shou_hui'){
                   
                    that.typeUserNum++
                }
                if(item.state!=''&&item.type!='dept'&&that.router.type == 'bu_fa'){
                    item.disableCheckbox = true
                    item.checked = false                    
                    // val[0].disabled = true
                }                            
                if(item.pId == 0){
                    item.expand = true
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
            // 数据引用关系，有待改进
            data.forEach(function (item) {
                // 对收回，补发人员进行判断
                if(item.state!='waiting'&&item.type!='dept'&&that.router.type == 'shou_hui'&&item.pId!=0){                    
                    item.disableCheckbox = true
                    item.disabled = false
                    // val.push('disabled')
                    val[0].disabled = true
                }else{
                    item.disableCheckbox = false
                }
                if(item.state!=''&&item.type!='dept'&&that.router.type == 'bu_fa'){
                    item.disableCheckbox = true
                    item.checked = false                    
                    val[0].disabled = true
                } 
            })
            this.baseData = val         
        },
        submit(){
            if(this.seletedPeople == undefined || this.seletedPeople == ''){
                this.$Toast('请选择正确人员')
                return
            }
            this.$Dialog.confirm({
                title: '标题',
                message: `你确定要提交给（${this.seletedPeople}）吗？`,
            })
            .then(() => {                             
                if(this.router.type=='shou_hui'){
                    this.submitDocto()
                }else{
                    this.submitDocback()
                }         
            })
            .catch(() => {
                
            });
        },
        submitDocback(){             
            try {
                this.zhixiPepole.workItemId = this.tiJiaoP.workitemId
                this.zhixiPepole.sign = this.router.peopData.sign
                this.zhixiPepole.activityCode = this.router.peopData.nodeCode
                
                appendItem(this.zhixiPepole).then(res=>{                    
                    if(res.code == 20000){
                        this.$Notify({ type: 'success', message: '提交成功' });
                        setTimeout(()=>{
                            window.history.back(-2);
                        },750)
                    }else{
                         
                    }                    
                })
            } catch (error) {
                console.log(error)
            }
        },
        // 收回接口
        submitDocto(){
            try {          
                // console.log(this.router.peopData)      
                this.toP.workItemId = this.tiJiaoP.workitemId
                this.toP.userCode = this.state.userInfo.userId                
                this.toP.documentId = this.tiJiaoP.documentId
                this.toP.activityType = ''
                getWorkItemToCancel(this.toP).then(res=>{                    
                    if(res.code == 20000){
                        this.$Toast({ type: 'success', message: '收回成功' });
                        setTimeout(()=>{
                            window.history.go(-2);
                        },750)
                    }else{
                         
                    }                    
                })
            } catch (error) {
                console.log(error)
            }
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