## 目录结构

```bash
.
├── dist/                          // 默认的 build 输出目录
├── mock/                          // mock 文件所在目录，基于 express
├── config/
    ├── config.js                  // umi 配置，同 .umirc.js，二选一
    ├── defaultSettings.js         // 默认配置
    ├── proxy.js                   // 代理
    ├── routes.js                  // 路由
└── src/                           // 源码目录，可选
    ├── layouts/index.js           // 全局布局
    ├── assets/                    // 本地静态资源
    ├── components/                // 业务通用组件
    ├── e2e/                       // 集成测试用例
    ├── models/                    // 全局 dva model
    ├── services/                  // 后台接口服务
    ├── utils/                     // 工具库
    ├── pages/                     // 业务页面入口和常用模板，里面的文件即路由
        ├── .umi/                  // dev 临时目录，需添加到 .gitignore
        ├── .umi-production/       // build 临时目录，会自动删除
        ├── document.ejs           // HTML 模板
        ├── 404.js                 // 404 页面
        ├── page1.js               // 页面 1，任意命名，导出 react 组件
        ├── page1.test.js          // 用例文件，umi test 会匹配所有 .test.js 和 .e2e.js 结尾的文件
        └── page2.js               // 页面 2，任意命名
    ├── global.css                 // 约定的全局样式文件，自动引入，也可以用 global.less
    ├── global.js                  // 可以在这里加入 polyfill
    ├── app.js                     // 运行时配置文件
├── .umirc.js                      // umi 配置，同 config/config.js，二选一
├── .env                           // 环境变量
└── package.json

```

## 安装依赖

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## 项目启动

```bash
npm start
```

## 项目打包

```bash
npm run build
```

## 代码规范检查

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

## 开发要求

1、请求使用项目封装的 request。 2、代码规范开启本地 eslint 和 Prettier 进行代码格式化。 3、单纯的业务组件必须包含 models 和 services，不需要当放入 src/models、src/services。 4、表单提交必须防重复、数据加载必须 loading。

## Dva.js

### Model

在 umi 项目中，你可以使用 dva 来处理数据流，以响应一些复杂的交互操作。这些处理数据流的文件统一放在 models 文件夹下，每一个文件默认导出一个对象，里面包含数据和处理数据的方法，通常我们称之为 model 。一个 model 文件的结构一般是这样的：

```bash
export default {
  namespace: 'example', // 这个 model 的名字，必须全局唯一,否则相同namespace的代码会产生影响
  state: {
    count: 0,
  }, // 初始数据
  reducers: {
    save() { ... },
  }, // 用于修改数据
  effects: {
    *getData() { ... },
  }, // 用于获取数据
  subscriptions: {
    setup() { ... },
  }, // 用于订阅数据
}
```

### Reducer

每一个 reducer 都是一个普通函数，接受 state 和 action 作为参数，即：(state, action) => state ，你可以在函数中更改旧的 state，返回新的 state。

```bash
reducers: {
  save(state, { payload }) {
    return ({ ...state, ...payload });
  },
},
```

### Effect

每一个 effect 都是一个 生成器函数 ，你可以在这里获取你需要的数据，例如向服务器发起一个请求、或是获取其他 model 里的 state 。为了明确分工，你无法在 effect 中直接修改 state ，但你可以通过 put 方法 调用 reducer 来修改 state。

```bash
state:{
  assets:{},
},
*changeAssets({ payload }, { call, put, select }) {
  const user = yield select(states => states.user);
  const assets = yield call(fetchData, user);
  yield put({ type: 'save', payload: { assets } });
},
```

#### Effect-select

此方法用于获取当前或其他 model 的 state。

```bash
const data = yield select(states => states[namespace]);
```

#### Effect-call

此方法用于执行一个异步函数，可以理解为等待这个函数执行结束。项目中常用于发送 http 请求，等待服务端响应数据。

```bash
const data = yield call(doSomethingFunc, parameter);
```

#### Effect-put

此方法用于触发一个 action，这个 action 既可以是一个 reducer 也可以是一个 effect

```bash
yield put({ type: 'reducerName', payload: { page } });
```

### Subscription

subscription 用于订阅一个数据源，根据需要使用 dispatch 触发相应的 action。数据源可以是当前的时间、服务器的 websocket 连接、keyboard 输入、geolocation 变化、history 路由变化等等。 项目中常用于页面初始化数据的自动请求，如：

```bash
subscriptions: {
  setup({ dispatch, history }) {
    return history.listen(({ pathname, query }) => {
      // 进入 '/home' 路由，发起一个名叫 'query' 的 effect
      if (pathname === '/home') {
        dispatch({ type: 'query' });
      }
    });
  },
},
```

### dispatch

类似 effect 中的 put 方法，你可以在 subscription 的参数、或是一个已经 connect 过的组件的 props 中拿到。

### connect

通过此方法在你的组件中获取到指定 model 的 state 数据

```bash
import { connect } from 'dva';
function App({ user, dispatch }) {
  const handleClick = () => {
    dispatch({ type: 'user/fetchUser' });
  };
  return (
    <div>
      <h2>Hello, {user}</h2>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
export default connect(({ user }) => ({ user }))(App);
```

如果使用 es7 的装饰器则为：

```bash
import { connect } from 'dva';
@connect(({ user }) => ({ user }))
function App({ user, dispatch }) {
  const handleClick = () => {
    dispatch({ type: 'user/fetchUser' });
  };
  return (
    <div>
      <h2>Hello, {user}</h2>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
}
export default App;
```

## 项目开发中

### 创建页面

page 下：

```bash
umi g page item
// create src/pages/item.js
// create src/pages/item.css
// ✔  success
```

page/file 下:

```bash
umi g page item/file --less
// create src/pages/item/file.js
// create src/pages/item/file.less
// ✔  success
```

### 关于 css

1、命名：类名使用小写字母，以中划线分隔； id 采用驼峰式命名。

2、jsx 中使用：

```bash
className={styles.***}
```

or

```bash
className={styles['word-word']}
```

多个：

```bash
className={`${styles.className1} ${styles.className2}`}
```

3、修改 antd 默认样式：使用:global

```bash
// 注：若想在某个文件中覆盖 antd 样式，请加上一个类似 .override-ant-btn 的类包裹住 global 修饰的名称，以避免全局样式声明分散在项目各处
:global(.ant-space-item)
```

### 关于组织权限

框架中对组件 export 的 RenderAuthorized 函数进行了基本封装，默认传入当前的权限（mock 数据），因此在脚手架中使用时，无需再关注当前权限。

```bash
import Authorized from '@/utils/Authorized';

const noMatch = null; // view without permission

<Authorized authority="admin" noMatch={noMatch}>
  ...views with permissions
</Authorized>
// authority： 谁能看
// 多个权限时： authority={['admin', 'user']}
// noMatch：当没有权限时看到什么
```

### 统一表格 使用 Procomponents-ProTable （高级表格）

依托于 ProForm 的能力，ProForm 拥有多种形态，可以切换查询表单类型，设置变形成为一个简单的 Form 表单，执行新建等功能

#### ProTable-API https://procomponents.ant.design/components/table#api

ProTable 在 antd 的 Table 上进行了一层封装，支持了一些预设，并且封装了一些行为。这里只列出与 antd Table 不同的 api。

request

request 是 ProTable 最重要的 API，request 会接收一个对象。对象中必须要有 data 和 success，如果需要手动分页 total 也是必需的。request 会接管 loading 的设置，同时在查询表单查询和 params 参数发生修改时重新执行。同时 查询表单的值和 params 参数也会带入。以下是一个实例：

```bash
<ProTable<T, U>
  // params 是需要自带的参数
  // 这个参数优先级更高，会覆盖查询表单的参数
  params={params}
  request={async (
    // 第一个参数 params 查询表单和 params 参数的结合
    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
    params: T & {
      pageSize: number;
      current: number;
    },
    sort,
    filter,
  ) => {
    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
    // 如果需要转化参数可以在这里进行修改
    const msg = await myQuery({
      page: params.current,
      pageSize: params.pageSize,
    });
    return {
      data: msg.result,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: boolean,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: number,
    };
  }}
/>
```

## 附：

UI-antd@4.0+: https://ant.design/index-cn; Umi@2+: https://v2.umijs.org/zh/; antd-pro@4.0: +https://pro.ant.design/; Procomponents: https://procomponents.ant.design/components; (ProTable、Layout)
