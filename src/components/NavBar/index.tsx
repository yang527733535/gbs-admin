import React, { useState, useEffect } from 'react';
import {
  Tooltip,
  Button,
  Avatar,
  Select,
  Typography,
  Dropdown,
  Menu,
  Space,
  Image,
  Modal,
} from '@arco-design/web-react';
import { IconSunFill, IconMoonFill } from '@arco-design/web-react/icon';
import { useSelector, useDispatch } from 'react-redux';
import { ReducerState } from '../../redux';
import useLocale from '../../utils/useLocale';
import history from '../../history';
import { resLogout } from '../../api/user.js';
import MessageBox from '../MessageBox';

import styles from './style/index.module.less';
import PwdForm from './PwdForm';
function Navbar() {
  const locale = useLocale();
  const theme = useSelector((state: ReducerState) => state.global.theme);
  const dispatch = useDispatch();
  const [userInfo, setuserInfo] = useState(null);
  const [showPwdModal, setshowPwdModal] = useState<boolean>(false);
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setuserInfo(userInfo);
    }
  }, []);

  async function logout() {
    localStorage.setItem('userStatus', 'logout');
    const data = await resLogout();

    if (data.code === 200) {
      localStorage.clear();
      history.push('/user/login');
    }
  }

  function onMenuItemClick(key) {
    if (key === 'logout') {
      logout();
    }
    if (key === 'editpwd') {
      setshowPwdModal(true);
    }
  }
  const closeModal = () => {
    setshowPwdModal(false);
  };
  return (
    <div className={styles.navbar}>
      <Modal
        unmountOnExit
        onCancel={() => {
          setshowPwdModal(false);
        }}
        footer={null}
        visible={showPwdModal}
        title="修改密码"
      >
        <PwdForm closeModal={closeModal}></PwdForm>
      </Modal>
      <div className={styles.left}>
        <Space size={8}>
          <Image
            src="https://gbs.toptian.com/image/show?file=drama_I00111-1642061758.png"
            width={50}
          ></Image>
          <Typography.Title style={{ margin: 0, fontSize: 18 }} heading={5}>
            梦墨·绘梦馆
          </Typography.Title>
        </Space>
      </div>
      <ul className={styles.right}>
        <li>
          <MessageBox />
        </li>
        {/* <li>
          <a>{locale['navbar.docs']}</a>
        </li> */}
        <li>
          <Select
            options={[
              { label: '中文', value: 'zh-CN' },
              { label: 'English', value: 'en-US' },
            ]}
            value={localStorage.getItem('arco-lang')}
            bordered={false}
            triggerProps={{
              autoAlignPopupWidth: false,
              autoAlignPopupMinWidth: true,
              position: 'bl',
            }}
            onChange={(value) => {
              localStorage.setItem('arco-lang', value);
              window.location.reload();
            }}
          />
        </li>
        <li>
          <Tooltip
            content={
              theme === 'light'
                ? locale['settings.navbar.theme.toDark']
                : locale['settings.navbar.theme.toLight']
            }
          >
            <Button
              type="text"
              icon={theme === 'light' ? <IconMoonFill /> : <IconSunFill />}
              onClick={() =>
                dispatch({
                  type: 'toggle-theme',
                  payload: { theme: theme === 'light' ? 'dark' : 'light' },
                })
              }
              style={{ fontSize: 20 }}
            />
          </Tooltip>
        </li>
        {userInfo && (
          <li>
            <Avatar size={24} style={{ marginRight: 8 }}>
              <img
                alt="avatar"
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202103%2F05%2F20210305151654_c9262.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1641181441&t=baf1378f1b1e975ed337c5447725fd69"
              />
            </Avatar>
            <Dropdown
              trigger="click"
              droplist={
                <Menu onClickMenuItem={onMenuItemClick}>
                  <Menu.Item key="info">个人信息</Menu.Item>
                  <Menu.Item key="editpwd">修改密码</Menu.Item>
                  <Menu.Item key="logout">退出登录</Menu.Item>
                </Menu>
              }
            >
              <Typography.Text className={styles.username}>{userInfo.user_name}</Typography.Text>
            </Dropdown>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Navbar;
