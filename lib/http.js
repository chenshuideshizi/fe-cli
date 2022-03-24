// 通过 axios 处理请求
const axios = require('axios')

axios.interceptors.response.use(res => {
  return res.data;
})

/**
 * 获取分支信息
 * @param {string} repo 模板名称
 * @returns Promise
 */
 async function  getBranchList() {
  return axios.get(`https://api.github.com/repos/winfrise/fe-cli-template/branches`)
}

module.exports = {
  getBranchList
}