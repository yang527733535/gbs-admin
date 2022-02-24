import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Breadcrumb,
  Card,
  Select,
  Space,
  Modal,
  InputNumber,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { CarList, shopList } from '../../api/drama.js';
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
  const [visitModal, setvisitModal] = useState(false);
  const [gamevisitModal, setgamevisitModal] = useState(false);
  const [clickItem, setclickItem] = useState(null);
  const [store_code, setstore_code] = useState(null);
  const [gb_code, setgb_code] = useState(null);
  const [game_people, setgame_people] = useState(null);
  const [storeOptions, setstoreOptions] = useState([]);

  useEffect(() => {
    setstoreOptions(JSON.parse(localStorage.getItem('Allshop'))['store_code']);
  }, []);

  const columns = [
    {
      title: '剧本名称',
      dataIndex: 'gb_title',
    },
    {
      title: '玩家人数',
      dataIndex: 'game_people',
    },
    {
      title: '状态',
      dataIndex: 'game_status',
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
      title: locale['searchTable.columns.createdTime'],
      dataIndex: 'created_time',
    },
    {
      title: '更新时间',
      dataIndex: 'updated_time',
    },
    {
      title: locale['searchTable.columns.operations'],
      render: (_, data) => (
        <Space>
          <Button
            onClick={() => {
              console.log(data);
              setclickItem(data);
              setvisitModal(true);
            }}
            size="mini"
            type="primary"
          >
            修改
          </Button>
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
  const { data, pagination, loading, formParams } = searchTableState;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData(current = 1, pageSize = 10, params = {}) {
    const data = CarList({
      page: current,
      page_size: pageSize,
      store_code,
      gb_code,
      game_people,
    });
    data.then((res) => {
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
          rowKey="user_account"
          loading={loading}
          onChange={onChangeTable}
          pagination={pagination}
          columns={columns}
          data={data}
        />
      </Card>
    </div>
  );
}

export default SearchTable;
