import React, { useState, useEffect } from 'react';
import { Spin, Tabs } from '@arco-design/web-react';
import { StoreDetailApi } from '../../../api/drama.js';
import RoomDetail from './roomDetail/index';
const TabPane = Tabs.TabPane;
export default function StoreDetail({ store_code }) {
  const [loading, setloading] = useState(false);
  const [storeDetailInfo, setstoreDetailInfo] = useState(false);
  useEffect(() => {
    getStoreDetail();
  }, []);
  const getStoreDetail = async () => {
    let param = { store_code };
    let data = await StoreDetailApi(param);
    if (data.code === 200) {
      setstoreDetailInfo(data.data);
      setloading(false);
    }
  };
  return (
    <>
      <div>
        <Tabs type="rounded">
          <TabPane key="1" title="店铺基础信息">
            <Spin loading={loading}>12312312</Spin>
          </TabPane>
          <TabPane key="2" title="店铺房间信息">
            <RoomDetail storeDetailInfo={storeDetailInfo} store_code={store_code}></RoomDetail>
          </TabPane>
          <TabPane key="3" title="店铺剧本信息"></TabPane>
          <TabPane key="4" title="店铺员工信息"></TabPane>
        </Tabs>
      </div>
    </>
  );
}
