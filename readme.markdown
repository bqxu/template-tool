# template-tool

```
    模版管理工具、生成代码模版，运行代码模版，生成代码。
```


## 使用

```bash
// use npm
npm install template-tool -g

// use yarn 
yarn global add template-tool -g
```


## 运行

安装成功后， 会有 `ttool` 和 `template-tool` 这两个命令，  `ttool` 与 `template-tool` 等效。

### 查看模版

```bash
// 列出本地可用全部模版
ttool ls
```

### 运行模版

```
//例子

// 会使用 ts-lite 模版
ttool run ts-lite


// 查看 ts-lite 模版的帮助文档
ttool run ts-lite help  
```


### 生成新的模版


```
// 创建新的模版 , 默认在当前文件下 生成 <newTemplateName> 文件夹， 模版项目, 可使用 -d 指定其他目录
ttool template new <newTemplateName>

// 如模版未发布到远处仓库， 可使用 run -tp <templatePath> 进行运行
```

### 发布远程模版


### 拉取模版

```
// 使用 git 仓库
ttool fetch git https://github.com/xxx/xxx 

// 使用 git 仓库
ttool fetch npm pkg

<!-- 模版默认安装在全局目录 `~user_home/.gen-code/templates` 下 -->

<!-- 可使用 -d . 命令，指定为当前目录-->
```

### 模版删除

```

// 删除 fetch 到本地的 模版， 内置模版不支持删除。
ttool template rm <name> 

```



## 运行机制

### 模块加载

模版使用 esModule ，进行动态加载。

所有模版的包类型需要是  "type": "module"


### runner.js

主程序会运行 模版包 目录下的 runner.js ，请不要修改 默认的 export ，其他可以自由发挥，

