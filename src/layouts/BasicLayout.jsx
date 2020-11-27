/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout from '@ant-design/pro-layout';
import React, { useEffect, useMemo, useRef } from 'react';
import { Link, connect, history } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo.svg';
import IconMap from './Icons';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);
/**
 * use Authorized check all menu item
 */

const menuDataRender = (menuList) => {
  return menuList.map((item) => {
    const localItem = {
      ...item,
      icon: item.icon && IconMap[item.icon],
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });
};

const defaultFooterDom = (
  <div style={{ textAlign: 'center' }}>{`${new Date().getFullYear()} 中软国际`}</div>
);

const BasicLayout = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    menuData, // 后台服务器返回的菜单数据
    loading,
  } = props;
  const menuDataRef = useRef([]);
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
      dispatch({ // 调用后台请求，获取菜单
        type: 'menu/fetchMenu',
      });
    }
  }, [dispatch]);
  /**
   * init variables
   */

  const handleMenuCollapse = (payload) => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = useMemo(
    () => getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
      authority: undefined,
    },
    [location.pathname, props.route.routes],
  );
  return (
    <ProLayout
      logo={logo}
      {...props}
      {...settings}
      breakpoint={false} // Antd的锅
      onCollapse={handleMenuCollapse}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: '首页',
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => defaultFooterDom}
      // menuDataRender={menuDataRender}
      menuDataRender={() => menuDataRender(menuData)}
      menu={{
        loading,
      }}
      rightContentRender={() => <RightContent />}
      postMenuData={(menuDatas) => {
        menuDataRef.current = menuDatas || [];
        return menuDatas || [];
      }}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings, menu }) => ({
  collapsed: global.collapsed,
  settings,
  menuData: menu.menuData, // connect连接menu
  loading: menu.loading,
}))(BasicLayout);
