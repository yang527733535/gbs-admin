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

export function reqBindrole(data) {
  return Service({
    url: '/v1/drama/save-role',
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
