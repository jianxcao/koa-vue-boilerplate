# koa-vue-boilerplate

## 功能说明

- 支持vue2版本的编译
- 支持客户端服务端的同步编译
- npm run dev 启动测试服务器，带热更新
- npm run debug debug模式启动服务器，带热更新
- npm run dev:watch 以watch模式启动，文件落到磁盘上
- npm run debug:watch 以watch模式启动debug，文件落在磁盘上
- npm run build build代码，准备上线
- npm run start pm2启动服务器

## 项目结构说明
``` bash
App
├── package.json
├── app
|   ├── routers
│   ├── middleware
│   ├── service
│   ├── utils
│   ├── view
│   ├── extend
│   │   ├── helper.js 
│   │   ├── context.js
│   │   └── application.js
│   └── web
├── build目录
│ 
├── config
|   ├── log.json
|   ├── config.default.js
│   ├── config.prod.js
|   ├── config.local.js 
└── logs
```

* app/routers 是所有路由目录，在路由目录可以直接调用模板渲染和service服务
* app/middleware 是所有的中间件，目前自带 Koa-view , Koa-vue-view用来渲染vue模板
* app/service 是所有服务的编写目录，可以将代码的业务逻辑写在这里
* app/utils 是一些utils方法
* app/view 是后端渲染模板编译后放置的目录，无需理会，编译后模板会自动生成在这个目录里面
* app/extend 可以对helper对象，context对象，application对象进行扩展出自己想要的对象，或者方法
* app/web目录是所有前端相关的资源目录
* app/app.js 整个app的入口,扩展koa对象
* app/dev 这个dev环节需要附加的中间件或者操作都在这里
* app/index 整个应用的入口
* config目录存放所有配置
* build目录存放所有编译相关

## 内置对象说明

* koa的application对象
  * 扩展config对象，表示整个应用的配置
  * 扩展logger对象，可以渠道日志对象
  * 通过co模块扩展toAsyncFunction方法
  * 通过co模块扩展toPromise方法
  * 扩展extend/application下的所有对象
  * 通过koa-view中间件扩展view相关方法，属性包括 （render方法，renderView方法，renderString方法，view属性）
  * 通过koa-vue-view扩展vue属性，可以获取vue编译引擎的对象

* koa的context对象
  * 扩展APP对象可以逆向获取app对象
  * 扩展logger对象，可以获取logger对象
  * 扩展helper对象可以获取extend/helper中的对象
  * 扩展extend/context下的所有对象
  * 通过koa-vue-view扩展vue渲染相关的对象 (包括renderClient方法, renderVueClient方法)

## 运行环境

- prod表示在线环境

- development表示本地环境

> 编译采用 [easywebpack](https://www.yuque.com/easy-team/easywebpack)

## config配置对象说明

- config.default.js表示默认配置，不管在哪个环境下都会加载

- config.local.js表示本地环境才加载

- config.prod.js表示在线环境才加载
- Log.json是日志级别配置文件，采用[log4js](https://github.com/log4js-node/log4js-node)

>  所有配置对象会在app/config.js中加载，加载会对相对对象进行深度合并，但是数组元素会被覆盖

## node调试使用

## 日志说明

## 编译说明

##假数据模拟
