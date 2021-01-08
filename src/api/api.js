import axios from '@/config/httpConfig'
/*
 *master变量
 *iosAndroid为原生端实现 window.master = 'iosAndroid'
 *编号version参数，北京局和国际公司，信息公司numberVersion
 *H5为web端实现 window.master = 'H5'
 */
/*****************北京局测试环境**************/
window.master = 'iosAndroid'
const baseOaUrl = 'http://192.168.65.94:8077/carsoa-document-dmz'
const documentURL = 'http://192.168.65.94:8078/carsoa-base-dmz'

/*****************北京局正式环境**************/
// window.master = 'iosAndroid'
// const baseOaUrl = 'http://10.3.183.114:8101/carsoa-document-dmz'
// const documentURL = 'http://10.3.183.114:8001/carsoa-base-dmz'

/*****************信息公司正式环境************/
// window.master = 'H5'
// const documentURL = 'http://10.3.176.212:8001/carsoa-base-dmz';
// const baseOaUrl = 'http://10.3.175.218:8001/carsoa-document-dmz';

export var viewUrl = baseOaUrl;
// 待办条数
export function getOaDocumentTotle(params) {
    return axios.get(baseOaUrl + '/document/getOaDocumentTotle', params)
}
// 公文列表
export function docList(url, params) {
    return axios.get(baseOaUrl + url, params)
}
// 关注列表
export function getAttentionList(params) {
    return axios.post(baseOaUrl + '/attention/getAttentionList', params)
}
// 详情数据
export function getDocumentDeail(params) {
    return axios.get(baseOaUrl + '/document/getDocumentDeail', params)
}
//按钮权限
export function getWorkItemOptions(params) {
    return axios.get(baseOaUrl + '/sysButton/getWorkItemOptions', params)
}
// 意见保存
export function saveOpinion(params) {
    return axios.post(baseOaUrl + '/oaOpinion/saveOpinion', params)
}
// 下一节点人员
export function nextNodeUserTree(params) {
    return axios.get(baseOaUrl + '/workitem/nextNodeUserTree', params)
}
//关注
export function payAttention(params) {
    return axios.post(baseOaUrl + '/attention/payAttention', params)
}
//取消关注
export function cancelAttention(params) {
    return axios.post(baseOaUrl + '/attention/cancelAttention', params)
}
// 知悉人员
export function findBasicDeptUserTreeByUserIds(params) {
    return axios.get(documentURL + '/sysUser/findBasicDeptUserTreeByUserIds', params)
}
// 补发
export function knowItem(params) {
    return axios.post(baseOaUrl + '/workflow/knowItem', params)
}
// 补发
export function afterReadingItem(params) {
    return axios.post(baseOaUrl + '/workflow/afterReadingItem', params)
}
// 收回
export function reissueUserTree(params) {
    return axios.get(baseOaUrl + '/workitem/reissueUserTree', params)
}
// 追加
export function appendItem(params) {
    return axios.post(baseOaUrl + '/workflow/appendItem', params)
}
export function recoverUserTree(params) {
    return axios.get(baseOaUrl + '/workitem/recoverUserTree', params)
}
// pdf展示
export function onlinePreview(params) {
    return axios.get(baseOaUrl + '/preview/onlinePreview', params)
}
// 流程跟踪
export function getInstanceDetail(params) {
    return axios.get(baseOaUrl + '/document/getInstanceDetail', params)
}
// 获取字典信息
export function getBasicDeptUserByIds(params) {
    return axios.get(documentURL + '/sysUser/getBasicDeptUserByIds', params)
}
// 获取流程信息
export function getByWorkitemId(params) {
    return axios.get(baseOaUrl + '/workitem/getByWorkitemId', params)
}

// 提交
export function carsoaSubmit(params) {
    return axios.post(baseOaUrl + '/workflow/carsoaSubmit', params)
}
// 获取保存
export function getCandidateNo(params) {
    return axios.get(baseOaUrl + '/oaNumber/v1/getCandidateNo', params)
}
// 验证编号
export function validateNo(params) {
    return axios.post(baseOaUrl + '/oaNumber/validateNo', params)
}
// 保存意见
export function savedoc(params) {
    return axios.post(baseOaUrl + '/document/savedoc', params)
}
export function getSearchConditionByCompany(params) {
    return axios.get(baseOaUrl + '/businessDict/v1/getSearchConditionByCompany', params)
}
// 交办
export function checkAbConfigureExists(params) {
    return axios.get(documentURL + '/abRole/checkAbConfigureExists', params)
}
// 阅毕
export function getWorkItemToCancel(params) {
    return axios.post(baseOaUrl + '/workflow/getWorkItemToCancel', params)
}
// 获取公文类字典
export function findBusinessDicts(params) {
    return axios.get(baseOaUrl + '/businessDict/findBusinessDicts', params)
}
// 常用意见
export function getoftenComments(params) {
    return axios.get(documentURL + '/oftenComments/list', params)
}
// 
export function consultationItem(params) {
    return axios.post(baseOaUrl + '/workflow/consultationItem', params)
}
// 会签反馈
export function feedBackOaOpinion(params) {
    return axios.post(baseOaUrl + '/oaOpinion/feedBackOaOpinion', params)
}
// 退回
export function getWorkItemToBack(params) {
    return axios.post(baseOaUrl + '/workflow/getWorkItemToBack', params)
}
// 登录
export function getoatoken1(params) {
    return axios.post(documentURL + '/getoatoken1', params)
}
// 获取原始稿纸
export function getListOriginPage(params) {
    return axios.post(baseOaUrl + '/getListOriginPage', params)
}
// 获取人员基础信息
export function findByUsername(params) {
    return axios.get(documentURL + '/findByUsername', params)
}

// 获取主办人员信息
export function findZhuBanlist(params) {
    return axios.get(documentURL + '/findZhuBanlist', params)
}

// 获取主办部门和协办部门信息接口
export function findByDeptId(params) {
    return axios.get(documentURL + '/sysUser/findBanliDept', params)
}