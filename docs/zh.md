**开发**

- sudo npm link 把测试包挂载到全局
- sudo npm unlink 撤销挂载

**错误解决**

npm ERR! 403 403 Forbidden-[FORBIDDEN] Public registration is not allowed

安装nrm: ```sudo npm install -g nrm```
执行 ```nrm use npm```

**发布到npm**

```npm publish --access public```

**参考**
https://juejin.cn/post/6966119324478079007#heading-22

GitHub Api: https://docs.github.com/en/rest/reference/branches#list-branches