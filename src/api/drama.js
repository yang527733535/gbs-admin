import { Service } from '../service/request';

// 数据字典
export function labelsApi(data) {
  return Service({
    url: '/system/dict/labels',
    method: 'POST',
    data,
  });
}
export function reqReadDict(data) {
  return Service({
    url: '/system/dict/read',
    method: 'POST',
    data,
  });
}

// reqReadDict

export function dictcategoryApi(data) {
  return Service({
    url: '/system/dict/category',
    method: 'GET',
  });
}

export function loginApi(data) {
  return Service({
    url: '/system/user/login',
    data,
    method: 'POST',
  });
}

export function dramaList(data) {
  return Service({
    url: '/v1/drama/list',
    data,
  });
}

export function getUserList(data) {
  return Service({
    url: '/v1/option/user',
    data,
  });
}

export function getDmList(data) {
  return Service({
    url: '/v1/option/user-dm',
    data,
  });
}

export function shopList(data) {
  return Service({
    url: '/v1/store/list',
    data,
    method: 'post',
  });
}

export function CarList(data) {
  return Service({
    url: '/v1/game/list',
    data,
    method: 'post',
  });
}

// 菜单列表
export function menuList(data) {
  return Service({
    url: '/system/menu/list',
    data,
    method: 'post',
  });
}

export function resLogout() {
  return Service({
    url: '/system/user/logout',
    // data: data,
  });
}

export function addDrama(data) {
  return Service({
    url: '/v1/drama/add',
    data,
  });
}

export function addShop(data) {
  return Service({
    url: '/v1/store/add',
    data,
  });
}

// 添加菜单
export function addMenu(data) {
  return Service({
    url: '/system/menu/add',
    data,
  });
}

// 添加字典
export function addLabel(data) {
  return Service({
    url: '/system/dict/add-label',
    data,
  });
}

// 添加组局
export function addGame(data) {
  return Service({
    url: '/v1/game/added',
    data,
  });
}

export function updateShop(data) {
  return Service({
    url: '/v1/store/edit',
    data,
  });
}
// addDrama

export function regionsList() {
  return Service({
    url: '/system/basic/regions',
    method: 'GET',
  });
}

export function reqBindDm(data) {
  return Service({
    url: '/v1/drama/add-dm',
    data,
    method: 'post',
  });
}

export function reqBindDeleteDm(data) {
  return Service({
    url: '/v1/drama/del-dm',
    data,
    method: 'post',
  });
}

export function reqBindrole(data) {
  return Service({
    url: '/v1/drama/save-role',
    data,
    method: 'post',
  });
}

export function reqDeleteBindrole(data) {
  return Service({
    url: '/v1/drama/del-role',
    data,
    method: 'post',
  });
}

export function editDrama(data) {
  return Service({
    url: '/v1/drama/edit',
    data,
    method: 'post',
  });
}

export function dramaDetail(data) {
  return Service({
    url: '/v1/drama/view',
    data,
    method: 'post',
  });
}
export function bindDm(data) {
  return Service({
    url: '/system/user/set-dm',
    data,
    method: 'post',
  });
}

export function StoreDetailApi(data) {
  return Service({
    url: '/v1/store/view',
    data,
    method: 'post',
  });
}

export function reqBindRoom(data) {
  return Service({
    url: '/v1/store/add-room',
    data,
    method: 'post',
  });
}
export function reqEditRoom(data) {
  return Service({
    url: '/v1/store/edit-room',
    data,
    method: 'post',
  });
}

export function DeleteRoom(data) {
  return Service({
    url: '/v1/store/del-room',
    data,
    method: 'post',
  });
}

export function reqBindStaff(data) {
  return Service({
    url: '/v1/store/add-user',
    data,
    method: 'post',
  });
}

export function reqDeleteStaff(data) {
  return Service({
    url: '/v1/store/del-user',
    data,
    method: 'post',
  });
}

export function reqStoreBindDrama(data) {
  return Service({
    url: '/v1/store/add-drama',
    data,
    method: 'post',
  });
}

export function reqDeleteStoreDrama(data) {
  return Service({
    url: '/v1/store/del-drama',
    data,
    method: 'post',
  });
}

// 修改预约
export function reqUpdateDesc(data) {
  return Service({
    url: '/v1/subscribe/edit',
    data,
    method: 'post',
  });
}

// 取消预约
export function reqCancelDesc(data) {
  return Service({
    url: '/v1/subscribe/cancel',
    data,
    method: 'post',
  });
}

export function noticeList(data) {
  return Service({
    url: '/v1/notice/list',
    data,
    method: 'post',
  });
}

// 订单管理
export function OrderList(data) {
  return Service({
    url: '/v1/order/list',
    data,
    method: 'post',
  });
}
export function Addnotice(data) {
  return Service({
    url: '/v1/notice/add',
    data,
    method: 'post',
  });
}
export function Editnotice(data) {
  return Service({
    url: '/v1/notice/edit',
    data,
    method: 'post',
  });
}

export function starGame(data) {
  return Service({
    url: '/v1/game/start',
    data,
    method: 'post',
  });
}

export function reqCreateQRcode(data) {
  return Service({
    url: '/v1/store/room-qrcode',
    data,
    method: 'post',
  });
}
