import { Service } from '../service/request';

// 数据字典
export function labelsApi(data) {
  return Service({
    url: '/system/dict/labels',
    method: 'POST',
  });
}

export function loginApi(data) {
  return Service({
    url: '/system/user/login',
    data: data,
    method: 'POST',
  });
}

export function dramaList(data) {
  return Service({
    url: '/v1/drama/list',
    data: data,
  });
}

export function shopList(data) {
  return Service({
    url: '/v1/store/list',
    data: data,
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
    data: data,
  });
}

export function addShop(data) {
  return Service({
    url: '/v1/store/add',
    data: data,
  });
}

export function updateShop(data) {
  return Service({
    url: '/v1/store/edit',
    data: data,
  });
}
// addDrama
