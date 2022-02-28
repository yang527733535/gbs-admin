import { Alert, Form, Modal, Select } from '@arco-design/web-react';
import React, { useEffect, useState } from 'react';
import { ShopSelectOptiop } from './typings';
import styles from './style/index.module.less';
import { reqgetShopAndStoreApi } from '../../api/drama.js';
export default function Welcome() {
  const [shopSelectOptions, setshopSelectOptions] = useState<ShopSelectOptiop[]>();
  const [showModal, setshowModal] = useState(false);

  // 获取店铺数据
  useEffect(() => {
    getShopAndStore();
  }, []);
  useEffect(() => {
    if (!localStorage.getItem('nowshop')) {
      setshowModal(true);
    }
  }, []);

  const getShopAndStore = async () => {
    const data = await reqgetShopAndStoreApi();
    localStorage.setItem('Allshop', JSON.stringify(data.data));
    const { room_code, store_code } = data.data;
    setshopSelectOptions(store_code);
    let SMap = {};
    store_code.forEach((element) => {
      SMap[element.code] = element.name;
    });
    room_code.forEach((element) => {
      SMap[element.code] = element.name;
    });
    localStorage.setItem('SMap', JSON.stringify(SMap));
  };
  console.log('shopSelectOptions', shopSelectOptions);
  return (
    <div className={styles.container}>
      <Modal
        onOk={() => {
          setshowModal(false);
        }}
        title="当前店铺"
        visible={showModal}
      >
        <Form>
          <Form.Item label="店铺名称">
            <Select
              onChange={(e) => {
                localStorage.setItem('nowshop', e);
              }}
              placeholder="请选择当前店铺"
            >
              {shopSelectOptions?.map(({ code, name }) => {
                return (
                  <Select.Option key={code} value={code}>
                    {name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <div className={styles.content}>
        <Alert type="success" content="欢迎使用 梦墨Admin v1.2.0!" />
      </div>
    </div>
  );
}
