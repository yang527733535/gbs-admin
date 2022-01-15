import React, { useState } from 'react';
import RoomFrom from './roomform';
import { DeleteRoom } from '../../../../api/drama.js';
import { Button, Card, Message, Modal, Popconfirm, Space } from '@arco-design/web-react';
const { Meta } = Card;
export default function RoomDetail({ store_code, storeDetailInfo }) {
  console.log('storeDetailInfo: ', storeDetailInfo);
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
            height: 318,
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
                    style={{ width: '100%', transform: 'translateY(-20px)' }}
                    alt="dessert"
                    src={item.room_image}
                  />
                </div>
              }
            >
              <Meta
                title={item.room_name}
                description={
                  <>
                    房间备注
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
                          console.log('item', item);
                          item.store_code = store_code;
                          const res = await DeleteRoom(item);
                          if (res.code === 200) {
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
