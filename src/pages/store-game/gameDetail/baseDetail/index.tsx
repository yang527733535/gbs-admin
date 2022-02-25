import React, { useState, useEffect, useRef } from 'react';
import { Form, Spin, Grid, Table } from '@arco-design/web-react';
import styles from './style/index.module.less';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { reqGameDetail } from '../../../../api/drama.js';

const columns = [
  {
    title: 'game_code',
    dataIndex: 'game_code',
  },
  {
    title: 'gb_code',
    dataIndex: 'gb_code',
  },
  {
    title: 'is_pay',
    dataIndex: 'is_pay',
  },
  {
    title: 'order_code',
    dataIndex: 'order_code',
  },
  {
    title: 'player_id',
    dataIndex: 'player_id',
  },
  {
    title: 'player_name',
    dataIndex: 'player_name',
  },
  {
    title: 'player_note',
    dataIndex: 'player_note',
  },
  {
    title: 'player_type',
    dataIndex: 'player_type',
  },
  {
    title: 'player_user',
    dataIndex: 'player_user',
  },
  {
    title: 'store_code',
    dataIndex: 'store_code',
  },
  {
    title: 'updated_time',
    dataIndex: 'updated_time',
  },
  {
    title: 'created_time',
    dataIndex: 'created_time',
  },
];
export default function BaseDetail({ clickItem }) {
  const FormItem = Form.Item;
  const formRef = useRef<FormInstance>();
  // const [selectedRowKeys, setSelectedRowKeys] = useState();
  const [storeDetailInfo, setstoreDetailInfo] = useState(null);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    getStoreDetail();
  }, []);
  const getStoreDetail = async () => {
    let { store_code, room_code, game_code } = clickItem;
    const param = {
      store_code,
      room_code,
      game_code,
    };
    setloading(true);
    let resdata = await reqGameDetail(param);
    setloading(false);
    setstoreDetailInfo(resdata.data);
  };

  return (
    <div>
      <Spin loading={loading}>
        <h3>游戏详情</h3>
        <Form layout="vertical" ref={formRef} className={styles['form-group']}>
          <Grid.Row gutter={80}>
            <Grid.Col span={6}>
              <FormItem
                label="游戏编码"
                field="game_code"
                rules={[{ required: false, message: '请填写店铺名称' }]}
              >
                <span>{storeDetailInfo?.game_code}</span>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={6}>
              <FormItem
                rules={[{ required: false, message: '请填写店铺地区' }]}
                field="gb_title"
                label="剧本名称"
              >
                <span>{storeDetailInfo?.gb_title}</span>
              </FormItem>
            </Grid.Col>

            <Grid.Col span={6}>
              <FormItem
                label="剧本价格"
                field="gb_price"
                rules={[{ required: false, message: '请填写详细地址' }]}
              >
                <span>¥{storeDetailInfo?.gb_price}</span>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={6}>
              <FormItem
                label="游戏状态"
                field="game_status"
                rules={[{ required: false, message: '请填写店铺手机号码' }]}
              >
                <span>
                  {JSON.parse(localStorage.getItem('AllMaP'))['sys_game_status'][
                    storeDetailInfo?.game_status
                  ] || storeDetailInfo?.game_status}
                </span>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={6}>
              <FormItem
                label="店铺"
                field="store_code"
                rules={[{ required: false, message: '请填写店铺电话号码' }]}
              >
                {/* <span>{storeDetailInfo?.store_code}</span> */}
                <span>{JSON.parse(localStorage.getItem('SMap'))[storeDetailInfo?.store_code]}</span>
              </FormItem>
            </Grid.Col>
            <Grid.Col span={6}>
              <FormItem
                label="房间"
                field="room_code"
                rules={[{ required: false, message: '请填写门店级别' }]}
              >
                <span>{JSON.parse(localStorage.getItem('SMap'))[storeDetailInfo?.room_code]}</span>
              </FormItem>
            </Grid.Col>
          </Grid.Row>

          {/* <Grid.Row justify="end">
          <FormItem
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button
              onClick={async () => {
                if (formRef.current) {
                  try {
                    await formRef.current.validate();
                    if (modalType === 'add') {
                      console.log(formRef.current.getFields());
                      var data = await addShop(formRef.current.getFields());
                      if (data.code === 200) {
                        Message.success('添加成功');
                        closeDrawer();
                      }
                    } else {
                      const param = formRef.current.getFields();
                      console.log('param: ', param);
                      param.store_code = storeDetailInfo.store_code;
                      var data = await updateShop(param);
                      if (data.code === 200) {
                        Message.success('修改成功');
                        closeDrawer();
                      }
                    }
                  } catch (_) {
                    console.log(_);
                    console.log(formRef.current.getFieldsError());
                    Message.error('校验失败，请检查字段！');
                  }
                }
              }}
              type="primary"
              style={{ marginRight: 24 }}
            >
              提交
            </Button>
            <Button
              onClick={() => {
                formRef.current.resetFields();
              }}
            >
              重置
            </Button>
          </FormItem>
        </Grid.Row> */}
          <h3>玩家订单</h3>
          <Table
            rowKey="player_user"
            columns={columns}
            rowSelection={{
              type: 'checkbox',
              // selectedRowKeys: selectedRowKeys,
              // onChange: (selectedRowKeys, selectedRows) => {
              //   // setSelectedRowKeys(selectedRowKeys);
              // },
            }}
            data={storeDetailInfo?.game_players || []}
          />
        </Form>
      </Spin>
    </div>
  );
}
