import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, connect } from 'umi';
import React from 'react';
import logo from '../assets/logo.svg';
import styles from './LoginLayout.less';

const LoginLayout = (props) => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props,
  });
  const links = [{
    key: '这是底部1',
    title: '这是底部1',
    href: 'https://www.baidu.com/',
    blankTarget: true,
  }, {
    key: '这是底部2',
    title: '这是底部2',
    href: 'https://www.baidu.com/',
    blankTarget: true,
  }];
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Ant Design</span>
              </Link>
            </div>
          </div>
          {children}
        </div>
        <DefaultFooter links={links} copyright="这是右边描述！" />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(LoginLayout);
