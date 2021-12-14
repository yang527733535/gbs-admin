import React from 'react';
import { IconUser, IconGift } from '@arco-design/web-react/icon';
export const defaultRoute = 'user/shop'; // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
// const { user_menu } = userInfo;
// console.log('user_menu: ', user_menu);
// console.log(test(user_menu));
// export const routes =
// test(user_menu);

export const routes = [
  {
    name: '剧本管理',
    icon: <IconGift />,
    key: 'user/drama',
    componentPath: 'drama-table',
  },
  {
    name: '门店管理',
    icon: <IconGift />,
    key: 'user/shop',
    componentPath: 'shop-table',
  },
  // {
  //   name: '门店管理2',
  //   icon: <IconGift />,
  //   key: 'user/shop2',
  //   componentPath: 'shop-table2',
  // },
  {
    name: 'menu.list.user',
    key: 'user/userManagement',
    icon: <IconUser />,
    // <IconUser />
    componentPath: 'user-table',
  },
];
