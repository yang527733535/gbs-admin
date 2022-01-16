import React, { useState, useEffect } from 'react';
import { Tabs, Spin } from '@arco-design/web-react';
import { StoreDetailApi } from '../../../api/drama.js';
import RoomDetail from './roomDetail/index';
import StaffDetail from './staffDetail/index';
import BaseDetail from './baseDetail/index';
import StoreDramas from './storeDrama/index';
const TabPane = Tabs.TabPane;
export default function StoreDetail({ store_code, closeDrawer, modalType }) {
  const [loading, setloading] = useState(false);
  const [storeDetailInfo, setstoreDetailInfo] = useState({});
  useEffect(() => {
    getStoreDetail();
  }, []);
  const getStoreDetail = async () => {
    if (modalType !== 'edit') {
      return;
    }
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
        <Spin loading={loading}>
          <Tabs type="rounded">
            <TabPane key="1" title="店铺基础信息">
              <BaseDetail
                closeDrawer={closeDrawer}
                modalType={modalType}
                storeDetailInfo={storeDetailInfo}
              ></BaseDetail>
            </TabPane>
            {modalType === 'edit' && (
              <TabPane key="2" title="店铺房间信息">
                <RoomDetail
                  getStoreDetail={getStoreDetail}
                  storeDetailInfo={storeDetailInfo}
                  store_code={store_code}
                ></RoomDetail>
              </TabPane>
            )}
            {modalType === 'edit' && (
              <TabPane key="3" title="店铺剧本信息">
                <StoreDramas
                getStoreDetail={getStoreDetail}
                  storeDetailInfo={storeDetailInfo}
                  store_code={store_code}
                ></StoreDramas>
              </TabPane>
            )}
            {modalType === 'edit' && (
              <TabPane key="4" title="店铺员工信息">
                <StaffDetail
                  getStoreDetail={getStoreDetail}
                  storeDetailInfo={storeDetailInfo}
                  store_code={store_code}
                ></StaffDetail>
              </TabPane>
            )}
          </Tabs>
        </Spin>
      </div>
    </>
  );
}
