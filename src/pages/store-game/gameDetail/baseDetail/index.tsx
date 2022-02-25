import React, { useState, useEffect, useRef } from 'react';
import { Form, Spin, Grid, Table, Button, Modal, Select } from '@arco-design/web-react';
import styles from './style/index.module.less';
import { FormInstance } from '@arco-design/web-react/es/Form';
import { reqGameDetail, reqOrderdeduct } from '../../../../api/drama.js';

const columns = [
  {
    title: '游戏编码',
    dataIndex: 'game_code',
  },
  {
    title: '剧本编码',
    dataIndex: 'gb_code',
  },
  {
    title: '是否支付',
    dataIndex: 'is_pay',
    render: (item) => {
      return JSON.parse(localStorage.getItem('AllMaP'))['sys_pay_status'][item];
    },
  },
  {
    title: '订单编号',
    dataIndex: 'order_code',
  },
  {
    title: '玩家id',
    dataIndex: 'player_id',
  },
  {
    title: '玩家名称',
    dataIndex: 'player_name',
  },
  {
    title: '玩家备注',
    dataIndex: 'player_note',
  },
  {
    title: '玩家类型',
    dataIndex: 'player_type',
  },
  {
    title: '玩家帐号',
    dataIndex: 'player_user',
  },
  {
    title: '更新时间',
    dataIndex: 'updated_time',
  },
  {
    title: '创建时间',
    dataIndex: 'created_time',
  },
];
export default function BaseDetail({ clickItem }) {
  const FormItem = Form.Item;
  const formRef = useRef<FormInstance>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>();
  const [storeDetailInfo, setstoreDetailInfo] = useState(null);
  const [nowSeleceOrders, setnowSeleceOrders] = useState([]);
  const [loading, setloading] = useState(false);
  const [showmodal, setshowmodal] = useState(false);
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
      <Modal
        onCancel={() => {
          setshowmodal(false);
        }}
        footer={null}
        visible={showmodal}
      >
        <Form
          onSubmit={async (e) => {
            console.log(e);
            let param = {
              ...e,
              game_code: storeDetailInfo.game_code,
              store_code: storeDetailInfo.store_code,
              order_arr: nowSeleceOrders,
            };
            console.log('param,', param);
            let { data } = await reqOrderdeduct(param);
            console.log('data: ', data);
          }}
        >
          <FormItem field="member_account" label="付款账户">
            <Select style={{ width: 150 }}>
              {nowSeleceOrders.map(({ player_user }) => {
                return (
                  <Select.Option value={player_user} key={player_user}>
                    {player_user}
                  </Select.Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem>
            <Button
              style={{ display: 'flex', justifyContent: 'center', marginLeft: 100 }}
              type="primary"
              htmlType="submit"
            >
              提交
            </Button>
          </FormItem>
        </Form>
      </Modal>
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
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <h3>玩家订单</h3>
            <Button
              onClick={() => {
                setshowmodal(true);
                console.log('s123', nowSeleceOrders);
              }}
              type="primary"
            >
              批量支付
            </Button>
          </div>

          <Table
            rowKey="player_user"
            columns={columns}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                console.log('selectedRows: ', selectedRows);
                console.log('selectedRows: ', selectedRowKeys);
                setnowSeleceOrders(selectedRows);
                setSelectedRowKeys(selectedRowKeys);
              },
            }}
            data={storeDetailInfo?.game_players || []}
          />
        </Form>
      </Spin>
    </div>
  );
}
