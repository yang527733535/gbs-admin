import React, { useState, useEffect } from 'react';
import RoomFrom from './roomform';
import { DeleteRoom, reqCreateQRcode } from '../../../../api/drama.js';
import { Button, Card, Image, Message, Modal, Popconfirm, Space } from '@arco-design/web-react';
const { Meta } = Card;
export default function RoomDetail({ store_code, getStoreDetail, storeDetailInfo }) {
  console.log('store_code: ', store_code);
  useEffect(() => {
    console.log('storeDetailInfo', storeDetailInfo);
    let param = {
      store_code: storeDetailInfo.store_code,
      room_code: storeDetailInfo.room_code,
      is_edit: 0,
    };
    console.log(param);
  }, []);

  const { store_room } = storeDetailInfo;
  const [showForm, setshowForm] = useState<boolean>(false);
  const [modalType, setmodalType] = useState<string>('');
  const [saveClickItem, setsaveClickItem] = useState<any>();
  return (
    <>
      <Modal
        onCancel={() => {
          setshowForm(false);
        }}
        unmountOnExit
        footer={null}
        style={{ width: 700 }}
        visible={showForm}
      >
        <RoomFrom
          modalType={modalType}
          closeModal={() => {
            setshowForm(false);
            getStoreDetail();
          }}
          saveClickItem={saveClickItem}
          store_code={storeDetailInfo.store_code}
        ></RoomFrom>
      </Modal>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Card
          style={{
            width: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 328,
            marginLeft: 20,
            marginBottom: 20,
          }}
        >
          <Button
            onClick={() => {
              setshowForm(true);
              setmodalType('add');
            }}
          >
            添加房间
          </Button>
        </Card>
        {store_room.map((item) => {
          return (
            <Card
              hoverable
              style={{ width: 300, marginLeft: 20, marginBottom: 20 }}
              cover={
                <div
                  style={{
                    height: 204,
                    overflow: 'hidden',
                  }}
                >
                  <img
                    referrer-policy="no-referrer"
                    style={{ width: '100%', transform: 'translateY(-20px)' }}
                    alt="dessert"
                    src={item.room_image}
                  />
                </div>
              }
            >
              <Meta
                description={
                  <>
                    <div
                      style={{
                        display: 'flex',
                        fontSize: 16,
                        fontWeight: 700,
                        justifyContent: 'space-between',
                        marginBottom: 15,
                      }}
                    >
                      <div>{item.room_name}</div>
                      <Image width={80} height={80} src={item.room_qr_code} alt="" />
                    </div>
                    <Space style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                      <Button
                        onClick={() => {
                          setmodalType('edit');
                          setshowForm(true);
                          setsaveClickItem(item);
                        }}
                        type="primary"
                      >
                        修改
                      </Button>
                      <Popconfirm
                        title="确定删除该房间?"
                        onOk={async () => {
                          item.store_code = store_code;
                          const res = await DeleteRoom(item);
                          if (res.code === 200) {
                            getStoreDetail();
                            Message.info({ content: '删除成功' });
                          }
                        }}
                        onCancel={() => {
                          Message.error({ content: 'cancel' });
                        }}
                      >
                        <Button
                          onClick={() => {
                            console.log('storeDetailInfo', storeDetailInfo);
                          }}
                          status="danger"
                        >
                          删除
                        </Button>
                      </Popconfirm>
                      <Button
                        onClick={async () => {
                          console.log('生成二维码');
                          const param = {
                            store_code: storeDetailInfo.store_code,
                            room_code: item.room_code,
                            is_edit: 0,
                          };
                          console.log('paramitem', param);
                          const resdata = await reqCreateQRcode(param);
                          if (resdata.code === 200) {
                            getStoreDetail();
                            Message.info({ content: '删除成功' });
                          }
                        }}
                      >
                        生成二维码
                      </Button>
                    </Space>
                  </>
                }
              />
            </Card>
          );
        })}
      </div>
    </>
  );
}
