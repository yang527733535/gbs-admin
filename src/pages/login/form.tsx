import { Form, Input, Checkbox, Link, Button, Space, Message } from '@arco-design/web-react';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { IconLock, IconUser } from '@arco-design/web-react/icon';
import React, { useEffect, useRef, useState } from 'react';
import styles from './style/index.module.less';
import history from '../../history';
import { loginApi } from '../../api/user.js';
import { labelsApi } from '../../api/drama.js';

export default function LoginForm() {
  const formRef = useRef<FormInstance>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberPassword, setRememberPassword] = useState(false);

  function afterLoginSuccess(params) {
    // 记住密码
    if (rememberPassword) {
      localStorage.setItem('loginParams', JSON.stringify(params));
    } else {
      localStorage.removeItem('loginParams');
    }

    // 记录登录状态
    localStorage.setItem('userStatus', 'login');
    // 跳转首页
    window.location.href = history.createHref({
      pathname: '/',
    });
    window.location.reload();
  }

  async function login(params) {
    setErrorMessage('');
    setLoading(true);

    const res = await loginApi(params);
    console.log('res: ', res);
    if (res.code === 200) {
      Message.info('登录成功!');
      const token = `Bearer ${res.data.access_token}`;
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      localStorage.setItem('token', token);
      const labels = await labelsApi();
      localStorage.setItem('dicts', JSON.stringify(labels.data));
      afterLoginSuccess(params);
    } else {
      setErrorMessage('登录出错，请刷新重试');
      setLoading(false);
    }
  }

  function onSubmitClick() {
    formRef.current.validate().then((values) => {
      login(values);
    });
  }

  // 读取 localStorage，设置初始值
  useEffect(() => {
    const params = localStorage.getItem('loginParams');
    const rememberPassword = !!params;
    setRememberPassword(rememberPassword);
    if (formRef.current && rememberPassword) {
      const parseParams = JSON.parse(params);
      formRef.current.setFieldsValue(parseParams);
    }
  }, []);

  return (
    <div className={styles['login-form-wrapper']}>
      <div className={styles['login-form-title']}>登录 梦墨剧本杀</div>
      <div className={styles['login-form-sub-title']}>登录 梦墨剧本杀</div>
      <div className={styles['login-form-error-msg']}>{errorMessage}</div>
      <Form className={styles['login-form']} layout="vertical" ref={formRef}>
        <Form.Item field="user_account" rules={[{ required: true, message: '用户名不能为空' }]}>
          <Input prefix={<IconUser />} placeholder="用户名" onPressEnter={onSubmitClick} />
        </Form.Item>
        <Form.Item field="user_password" rules={[{ required: true, message: '密码不能为空' }]}>
          <Input.Password prefix={<IconLock />} placeholder="密码" onPressEnter={onSubmitClick} />
        </Form.Item>
        <Space size={16} direction="vertical">
          <div className={styles['login-form-password-actions']}>
            <Checkbox checked={rememberPassword} onChange={setRememberPassword}>
              记住密码
            </Checkbox>
            <Link>忘记密码？</Link>
          </div>
          <Button type="primary" long onClick={onSubmitClick} loading={loading}>
            登录
          </Button>
          <Button type="text" long className={styles['login-form-register-btn']}>
            注册账号
          </Button>
        </Space>
      </Form>
    </div>
  );
}
