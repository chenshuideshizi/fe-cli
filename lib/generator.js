const { getBranchList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const downloadGitRepo = require('download-git-repo') // 不支持 Promise
const util = require('util')
const path = require('path')
const chalk = require('chalk')

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态为修改为成功
    spinner.succeed();
    return result; 
  } catch (error) {
    // 状态为修改为失败
    spinner.fail('Request failed, refetch ...')
    console.log(error)
  } 
}

class Generator {
  constructor (name, targetDir){
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;

    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }


  // 获取用户选择的模板分支
  // 1）远程拉取对应的 branch 列表
  // 2）用户选择自己需要下载的 branch
  // 3）return 用户选择的 branch

  async getBranchList() {
    // 1）远程拉取对应的 branch 列表
    const branches = await wrapLoading(getBranchList, 'waiting fetch branch');
    if (!branches) return;
    
    // 过滤我们需要的 tag 名称
    const branchesList = branches.map(item => item.name);
    // 2）用户选择自己需要下载的 tag
    const { branch } = await inquirer.prompt({
      name: 'branch',
      type: 'list',
      choices: branchesList,
      message: 'Place choose a branch to create project'
    })

    // 3）return 用户选择的 tag
    return branch
  }

    // 下载远程模板
  // 1）拼接下载地址
  // 2）调用下载方法
  async download(branch){
    // 1）拼接下载地址
    const requestUrl = `chenshuideshizi/fe-cli-template#${branch}`

    // 2）调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      'waiting download template', // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir) // 参数2: 创建位置
    ) 
  }

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create(){
    
    // 1) 获取 tag 名称
    const branch = await this.getBranchList()
     
    // 2）下载模板到模板目录
    await this.download(branch)

    // 3）模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm run dev\r\n')
  }
}

module.exports = Generator;