import React from 'react';
//   menu_icon: string;
//   menu_id: string;
//   menu_name: string;
//   menu_code: string;
//   first_code:string;
//   menu_path: '';
//   children?: Array<Data>;
// }
// menu_icon: ""
// menu_id: "3"
// menu_name: "会员管理"
// menu_sort: "10"
// parent_id: "0"
// interface Cascader {
//   name: string;
//   key: string;
//   componentPath: string;
//   first_code:string;
//   children?: Array<Cascader>;
// }
// function test(tree: Array<Data>): Array<Cascader> {
//   const outArray: Array<Cascader> = [];
//   for (const data of tree) {
//     const out: Cascader = {
//       name: data.menu_name,
//       key: data.first_code + data.menu_path,
//       componentPath: data.menu_name + data.menu_id,
//     };
//     if (data.children && data.children.length) {
//       out.children = test(data.children);
//       out.key = data.menu_code;
//     }
//     outArray.push(out);
//   }
//   return outArray;
// }

export const defaultRoute = 'welcome'; // const userInfo = JSON.parse(localStorage.getItem('userInfo'));
// const { user_menu } = userInfo;
// console.log('user_menu: ', user_menu);
// console.log(test(user_menu));
// export const routes =
// test(user_menu);

export const routes = [
  // {
  //   name: 'menu.welcome',
  //   key: 'welcome',
  //   icon: <IconGift />,
  //   componentPath: 'welcome',
  // },
  // {
  //   name: 'menu.form.step',
  //   key: 'form/step',
  //   componentPath: 'step-form',
  // },
  {
    name: 'menu.list.user',
    key: 'list/searchTable',
    componentPath: 'search-table',
  },
];
