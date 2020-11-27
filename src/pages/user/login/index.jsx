import {
  AlipayCircleOutlined,
  LockTwoTone,
  MailTwoTone,
  MobileTwoTone,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, Space, message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { connect } from 'umi';
import { getFakeCaptcha } from '@/services/login';
import styles from './index.less';

const LoginMessage = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login = (props) => {
  const { userLogin = {}, submitting } = props;
  const { status, type: loginType } = userLogin;
  const [type, setType] = useState('account');

  const handleSubmit = (values) => {
    const { dispatch } = props;
    dispatch({
      type: 'login/login',
      payload: { ...values, type },
    });
  };

  return (
    <div className={styles.main}>
      <ProForm
        initialValues={{
          autoLogin: true,
        }}
        submitter={{
          render: (_, dom) => dom.pop(),
          submitButtonProps: {
            loading: submitting,
            size: 'large',
            style: {
              width: '100%',
            },
          },
        }}
        onFinish={async (values) => {
          handleSubmit(values);
        }}
      >
        <Tabs activeKey={type} onChange={setType}>
          <Tabs.TabPane
            key="account"
            tab={'账户密码登录'}
          />
          <Tabs.TabPane
            key="mobile"
            tab={'手机号登录'}
          />
        </Tabs>

        {status === 'error' && loginType === 'account' && !submitting && (
          <LoginMessage
            content={'账户或密码错误（admin/ant.design)'}
          />
        )}
        {type === 'account' && (
          <>
            <ProFormText
              name="userName"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={styles.prefixIcon} />,
              }}
              placeholder={'用户名: admin or user'}
              rules={[
                {
                  required: true,
                  message: '用户名是必填项！',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockTwoTone className={styles.prefixIcon} />,
              }}
              placeholder={'密码: ant.design'}
              rules={[
                {
                  required: true,
                  message: '密码是必填项！',
                },
              ]}
            />
          </>
        )}

        {status === 'error' && loginType === 'mobile' && !submitting && (
          <LoginMessage content="验证码错误" />
        )}
        {type === 'mobile' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileTwoTone className={styles.prefixIcon} />,
              }}
              name="mobile"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '手机号是必填项！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '不合法的手机号！',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <MailTwoTone className={styles.prefixIcon} />,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => (timing
                ? `${count} ${'获取验证码'}`
                : '获取验证码')
              }
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '验证码是必填项！',
                },
              ]}
              onGetCaptcha={async (mobile) => {
                const result = await getFakeCaptcha(mobile);

                if (result === false) {
                  return;
                }

                message.success('获取验证码成功！验证码为：1234');
              }}
            />
          </>
        )}
        <div
          style={{
            marginBottom: 24,
          }}
        >
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码 ?
          </a>
        </div>
      </ProForm>
      <Space className={styles.other}>
        其他登录方式 :
        <AlipayCircleOutlined className={styles.icon} />
        <TaobaoCircleOutlined className={styles.icon} />
        <WeiboCircleOutlined className={styles.icon} />
      </Space>
    </div>
  );
};

export default connect(({ login, loading }) => ({
  userLogin: login,
  submitting: loading.effects['login/login'],
}))(Login);
