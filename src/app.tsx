import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading, SettingDrawer } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import type { RequestInterceptor, ResponseError, ResponseInterceptor } from 'umi-request';
import { message, notification } from 'antd';
import { BASE_API_URL, getLogout } from './config';
import { config } from '@/pages/Map/components/configuration'
import { getLocalStorage, setLocalStorage } from './utils/tools';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  // const fetchUserInfo = async () => {
  //   try {
  //     const msg = await queryCurrentUser();
  //     return msg.data;
  //   } catch (error) {
  //     history.push(loginPath);
  //   }
  //   return undefined;
  // };
  // 如果不是登录页面，执行
  if (history.location.pathname !== loginPath) {
    // const currentUser = await fetchUserInfo();
    return {
      // fetchUserInfo,
      // currentUser,
      settings: defaultSettings,
      ...config,
    };
  }
  return {
    // fetchUserInfo,
    settings: defaultSettings,
    ...config,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      // const { location } = history;
      // 如果没有登录，重定向到 login
      // if (location.pathname !== loginPath) {
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      // history.push(loginPath);
      // }
    },

    links: isDev
      ? [
        <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
          <LinkOutlined />
          <span>OpenAPI 文档</span>
        </Link>,
        <Link to="/~docs" key="docs">
          <BookOutlined />
          <span>业务组件文档</span>
        </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    breadcrumbRender: (routers = []) =>
      routers.length === 1 ? [{ path: '', breadcrumbName: '' }, ...routers] : [...routers],
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children: any, props: { location: { pathname: string | string[]; }; }) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },

    // 面包屑每一项
    // itemRender: ({ path, breadcrumbName }) =>
    //   path ? (
    //     path !== window.location.pathname && isClickable(path) ? (
    //       <a href={path}>{breadcrumbName}</a>
    //     ) : (
    //       breadcrumbName
    //     )
    //   ) : null,

    ...initialState?.settings,
    headerRender: () => <h1 style={{ color: 'white' }}>Title</h1>,
  };
};

// const codeMessage = {
//   200: '服务器成功返回请求的数据。',
//   201: '新建或修改数据成功。',
//   202: '一个请求已经进入后台排队（异步任务）。',
//   204: '删除数据成功。',
//   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
//   401: '用户没有权限（令牌、用户名、密码错误）。',
//   403: '用户得到授权，但是访问是被禁止的。',
//   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
//   405: '请求方法不被允许。',
//   406: '请求的格式不可得。',
//   410: '请求的资源被永久删除，且不会再得到的。',
//   422: '当创建一个对象时，发生一个验证错误。',
//   500: '服务器发生错误，请检查服务器。',
//   502: '网关错误。',
//   503: '服务不可用，服务器暂时过载或维护。',
//   504: '网关超时。',
// };

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  // if (response && response.status) {
  //   const errorText = codeMessage[response.status] || response.statusText;
  //   const { status, url } = response;

  //   notification.error({
  //     message: `请求错误 ${status}: ${url}`,
  //     description: errorText,
  //   });
  // }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response
};
const getAuth = () => {
  // @ts-ignore
  const token = getLocalStorage('token');
  return token ? `Bearer ${token}` : undefined;
};

const requestInterceptor: RequestInterceptor = (url, options) => {
  if (url.endsWith('/token')) return { url, options };
  const headers = { ...options.headers, Authorization: getAuth()! };
  return { url, options: { ...options, headers } };
}

const responseInterceptor: ResponseInterceptor = (response,) => {
  if (response.status === 401 && !response.url.includes('/token')) {
    // message.error('登录已失效，请重新登录！', 2)
    // eslint-disable-next-line no-underscore-dangle
    getLogout()()
  }
  if (response.headers.get('Content-Type') === 'application/octet-stream') {
    if (response.status === 200)
      // 文件下载保存
      saveFile(response)
    else if (response.status === 400)
      response.text().then(msg => message.error(msg))
    else message.error('下载文件失败！')
  }
  return response;
}
// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  errorHandler,
  prefix: BASE_API_URL,
  requestInterceptors: [requestInterceptor],
  responseInterceptors: [responseInterceptor]
};

/** 从请求中，保存文件 */
function saveFile(response: Response) {
  response.blob().then((blob) => {
    const a = window.document.createElement('a');
    const downUrl = window.URL.createObjectURL(blob);// 获取 blob 本地文件连接 (blob 为纯二进制对象，不能够直接保存到磁盘上)
    const filename = response.headers.get('Content-Disposition')!.split('filename=')[1];
    a.href = downUrl;
    a.download = `${decodeURI(filename)}`;
    a.click();
    window.URL.revokeObjectURL(downUrl);
  });
}