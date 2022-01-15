import React, { useState } from 'react';
import RoomFrom from './roomform';
import { reqDeleteStaff } from '../../../../api/drama.js';
import { Button, Card, Table, Message, Modal, Popconfirm } from '@arco-design/web-react';
export default function RoomDetail({ store_code, getStoreDetail, storeDetailInfo }) {
  const { store_worker } = storeDetailInfo;
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

      <Card
        title="员工列表"
        extra={
          <Button
            type="primary"
            onClick={() => {
              setshowForm(true);
              setmodalType('add');
            }}
          >
            添加员工
          </Button>
        }
      >
        <Table
          size="mini"
          data={store_worker}
          columns={[
            {
              dataIndex: 'work_user',
              title: '店员名称',
            },
            {
              dataIndex: 'work_role',
              title: '角色',
            },
            {
              dataIndex: 'created_user',
              title: '创建者',
            },
            {
              dataIndex: 'created_time',
              title: '创建时间',
            },
            {
              title: '操作',
              render: (_, data: any) => {
                return (
                  <Popconfirm
                    title="确定删除店员?"
                    onOk={async () => {
                      let param = {
                        store_code: store_code.store_code,
                        user_account: data?.work_user,
                      };
                      const res = await reqDeleteStaff(param);
                      if (res.code === 200) {
                        Message.success('删除成功');
                        getStoreDetail();
                      }
                    }}
                  >
                    <Button size="mini" status="danger">
                      删除
                    </Button>
                  </Popconfirm>
                );
              },
            },
          ]}
        ></Table>
      </Card>
    </>
  );
}
