import React from 'react';
import { IconUserAdd, IconOrderedList, IconCopy, IconStar } from '@arco-design/web-react/icon';
export const defaultRoute = ''; // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
// const { user_menu } = userInfo;
// console.log('user_menu: ', user_menu);
// console.log(test(user_menu));
// export const routes =
// test(user_menu);

export const routes = [
  {
    name: '剧本管理',
    icon: <IconCopy />,
    key: 'user/drama',
    componentPath: 'drama-table',
  },
  {
    name: '门店管理',
    icon: <IconStar />,
    key: 'user/shop',
    componentPath: 'shop-table',
  },
  {
    name: '游戏组局',
    icon: <IconStar />,
    key: 'user/car',
    componentPath: 'car-table',
  },
  {
    name: '菜单管理',
    icon: <IconOrderedList />,
    key: 'user/muen',
    componentPath: 'muen-table',
  },
  {
    name: 'menu.list.user',
    key: 'user/userManagement',
    icon: <IconUserAdd />,
    // <IconUser />
    componentPath: 'user-table',
  },
];
