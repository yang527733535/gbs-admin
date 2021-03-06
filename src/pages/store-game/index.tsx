import React, { useEffect, useState } from 'react';
import {
  Table,
  Form,
  Button,
  Badge,
  Input,
  Breadcrumb,
  Card,
  Select,
  Space,
  Modal,
  InputNumber,
  Popconfirm,
  Message,
  Drawer,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { CarList, shopList, reqcompletegame } from '../../api/drama.js';
import GameDetail from './gameDetail';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import useLocale from '../../utils/useLocale';
import { ReducerState } from '../../redux';

import styles from './style/index.module.less';
import AddForm from './form/index.jsx';
import StartGameForm from './stargameform/index.jsx';

function SearchTable({}) {
  const locale = useLocale();
  const [showGameDetail, setshowGameDetail] = useState(false);
  const [EndGameModal, setEndGameModal] = useState(false);
  const [visitModal, setvisitModal] = useState(false);
  const [gamevisitModal, setgamevisitModal] = useState(false);
  const [clickItem, setclickItem] = useState(null);
  const [store_code, setstore_code] = useState(null);
  const [gb_code, setgb_code] = useState(null);
  const [game_people, setgame_people] = useState(null);
  const [storeOptions, setstoreOptions] = useState([]);
  const [loading, setloading] = useState(false);
  useEffect(() => {
    setstoreOptions(JSON.parse(localStorage.getItem('Allshop'))['store_code']);
  }, []);

  const columns = [
    {
      title: '剧本名称',
      dataIndex: 'gb_title',
    },
    {
      title: '店铺',
      dataIndex: 'store_code',
      render: (item) => {
        return JSON.parse(localStorage.getItem('SMap'))[item];
      },
    },
    {
      title: '房间',
      dataIndex: 'room_code',
      render: (item) => {
        return JSON.parse(localStorage.getItem('SMap'))[item];
      },
    },
    {
      title: '玩家人数',
      dataIndex: 'game_people',
    },
    {
      title: '状态',
      dataIndex: 'game_status',
      render: (item) => {
        return (
          <Space>
            <Badge status="default" />
            {JSON.parse(localStorage.getItem('AllMaP'))['sys_game_status'][item] || item}
          </Space>
        );
      },
    },
    {
      title: '主持人',
      dataIndex: 'dm_user',
    },
    {
      title: '开局时间',
      dataIndex: 'start_time',
    },

    {
      title: locale['searchTable.columns.createdTime'],
      dataIndex: 'created_time',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
    },
    {
      title: locale['searchTable.columns.operations'],
      fixed: 'right' as 'right',
      width: 230,
      render: (_, data) => (
        <Space>
          {/* <Button
            onClick={() => {
              setclickItem(data);
              setvisitModal(true);
            }}
            size="mini"
            type="primary"
          >
            修改
          </Button> */}
          {data.game_status === '1' && (
            <Button
              onClick={() => {
                setclickItem(data);
                setgamevisitModal(true);
              }}
              size="mini"
              type="primary"
            >
              开始游戏
            </Button>
          )}

          {data.game_status === '2' && (
            <Popconfirm
              title="确定结束游戏?"
              onOk={async () => {}}
              onCancel={() => {
                Message.error({ content: '取消' });
              }}
            >
              <Button
                onClick={() => {
                  setclickItem(data);
                  setEndGameModal(true);
                }}
                size="mini"
                type="primary"
                status="warning"
              >
                结束游戏
              </Button>
            </Popconfirm>
          )}
          <Button
            size="mini"
            onClick={async () => {
              setclickItem(data);
              setshowGameDetail(true);
            }}
          >
            游戏详情
          </Button>
        </Space>
      ),
    },
  ];

  // 获取店铺列表
  useEffect(() => {
    getShopList();
  }, []);
  const getShopList = async () => {
    const data = await shopList();
    console.log('data: ', data);
  };

  // shopList

  const searchTableState = useSelector((state: ReducerState) => state.searchTable);
  const { data, pagination, formParams } = searchTableState;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
    return () => {
      dispatch({ type: UPDATE_LIST, payload: { data: [] } });
    };
  }, [store_code]);

  function fetchData(current = 1, pageSize = 10, params = {}) {
    const data = CarList({
      page: current,
      page_size: pageSize,
      store_code,
      gb_code,
      game_people,
    });
    setloading(true);
    data.then((res) => {
      setloading(false);
      const { data, paginator } = res;
      dispatch({ type: UPDATE_LIST, payload: { data } });
      dispatch({
        type: UPDATE_PAGINATION,
        payload: {
          pagination: {
            ...pagination,
            current: paginator.page,
            pageSize: paginator.page_size,
            total: paginator.total_count,
          },
        },
      });
      dispatch({ type: UPDATE_LOADING, payload: { loading: false } });
      dispatch({ type: UPDATE_FORM_PARAMS, payload: { params } });
    });
  }

  function onChangeTable(pagination) {
    const { current, pageSize } = pagination;
    fetchData(current, pageSize, formParams);
  }
  useEffect(() => {
    setstore_code(localStorage.getItem('nowshop'));
  }, []);
  return (
    <div className={styles.container}>
      <Modal
        onCancel={() => {
          setEndGameModal(false);
        }}
        footer={null}
        visible={EndGameModal}
      >
        <Form
          onSubmit={async (e) => {
            const { game_code, store_code } = clickItem;
            const param = {
              game_code,
              store_code,
              extra_amount: e.extra_amount,
            };
            console.log(param);
            let resdata = await reqcompletegame(param);
            if (resdata.code === 200) {
              Message.info({ content: 'ok' });
              setEndGameModal(false);
              fetchData();
            }
          }}
          initialValues={{
            extra_amount: 0,
          }}
        >
          <Form.Item field="extra_amount" label="附加费">
            <Input style={{ width: 200 }}></Input>
          </Form.Item>
          <Form.Item style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Button style={{ marginLeft: 120 }} type="primary" htmlType="submit">
              结束游戏
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Drawer
        onCancel={() => {
          setshowGameDetail(false);
        }}
        footer={null}
        visible={showGameDetail}
        title="游戏详情"
        unmountOnExit={true}
        width="90vw"
      >
        <GameDetail clickItem={clickItem}></GameDetail>
      </Drawer>
      <Modal
        title={clickItem === null ? '添加组局' : '修改组局'}
        footer={null}
        onCancel={() => {
          setvisitModal(false);
        }}
        unmountOnExit
        style={{ width: 900, minWidth: 900 }}
        visible={visitModal}
      >
        <AddForm
          clickItem={clickItem}
          closeModalAndReqTable={() => {
            setvisitModal(false);
            fetchData();
          }}
        />
      </Modal>
      <Modal
        // title={clickItem === null ? '添加组局' : '修改组局'}
        title="开始游戏"
        footer={null}
        onCancel={() => {
          setgamevisitModal(false);
        }}
        unmountOnExit
        style={{ width: 900, minWidth: 900 }}
        visible={gamevisitModal}
      >
        <StartGameForm
          clickItem={clickItem}
          closeModalAndReqTable={() => {
            setgamevisitModal(false);
            fetchData();
          }}
        />
      </Modal>
      {/* StartGameForm */}
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>店铺运营</Breadcrumb.Item>
        <Breadcrumb.Item>店铺组局</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={() => {
                setvisitModal(true);
                setclickItem(null);
              }}
              type="primary"
            >
              添加组局
            </Button>
            <div>
              <Space style={{ marginLeft: 20 }} wrap>
                <Select
                  value={store_code}
                  onChange={(e) => {
                    setstore_code(e);
                  }}
                  style={{ width: 200 }}
                  placeholder="请选择店铺"
                >
                  {storeOptions.map((item) => {
                    return (
                      <Select.Option key={item.code} value={item.code}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>

                <Input
                  value={gb_code}
                  onChange={(e) => {
                    setgb_code(e);
                  }}
                  placeholder="请输入剧本编码"
                  style={{ width: 200 }}
                />
                <InputNumber
                  min={1}
                  value={game_people}
                  onChange={(e) => {
                    setgame_people(e);
                  }}
                  placeholder="请输入玩家人数"
                  style={{ width: 200 }}
                />

                <Button onClick={() => {}}>重置</Button>
                <Button
                  onClick={() => {
                    fetchData();
                  }}
                  type="primary"
                >
                  搜索
                </Button>
              </Space>
            </div>
          </div>
        </Card>
      </div>
      <Card bordered={false}>
        <Table
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          scroll={{ x: 2000 }}
          data={data}
        />
      </Card>
    </div>
  );
}

export default SearchTable;
