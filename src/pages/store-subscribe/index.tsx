import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Breadcrumb,
  Card,
  Space,
  Modal,
  Typography,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeSList } from '../../api/user.js';
import {
  UPDATE_FORM_PARAMS,
  UPDATE_LIST,
  UPDATE_LOADING,
  UPDATE_PAGINATION,
} from './redux/actionTypes';
import EditForm from './form/index.jsx';
import CancelForm from './cancelform/index.jsx';
import { ReducerState } from './redux';
import styles from './style/index.module.less';

function SearchTable() {
  const [store_code, setstore_code] = useState('');
  const [gb_code, setgb_code] = useState('');
  const [subscribe_dm, setsubscribe_dm] = useState('');
  const [subscribe_member, setsubscribe_member] = useState('');
  const [editFormModal, seteditFormModal] = useState(false);
  const [cancelFormModal, setcancelFormModal] = useState(false);
  const [clickItem, setclickItem] = useState('');
  const columns = [
    {
      title: '预定ID',
      dataIndex: 'subscribe_id',
    },
    {
      title: '剧本编码',
      dataIndex: 'gb_code',
    },
    {
      title: '开始时间',
      dataIndex: 'subscribe_start',
    },
    // {
    //   title: '结束时间',
    //   dataIndex: 'subscribe_end',
    // },
    {
      title: '会员账号',
      dataIndex: 'subscribe_member',
    },
    {
      title: '预约人数',
      dataIndex: 'subscribe_people',
    },
    {
      title: '首页推荐',
      dataIndex: 'peddle_is',
    },
    {
      title: '推荐文本',
      dataIndex: 'peddle_text',
    },
    {
      title: '房间',
      dataIndex: 'room_code',
    },
    {
      title: '预约状态',
      dataIndex: 'subscribe_status',
    },
    {
      title: '预约DM',
      dataIndex: 'subscribe_dm',
    },
    {
      title: '操作',
      render: (_, item) => {
        return (
          <Space>
            <Button
              onClick={async () => {
                seteditFormModal(true);
                setclickItem(item);
              }}
              size="mini"
              type="primary"
            >
              修改
            </Button>
            <Button
              onClick={async () => {
                setcancelFormModal(true);
                setclickItem(item);
              }}
              status="danger"
              size="mini"
              type="primary"
            >
              取消
            </Button>
          </Space>
        );
      },
    },
    // {
    //   title: '会员备注',
    //   dataIndex: 'subscribe_note',
    // },
    // {
    //   title: '店家备注',
    //   dataIndex: 'subscribe_remarks',
    // },
  ];
  const searchTableState = useSelector((state: ReducerState) => state.searchTable);
  const { data, pagination, loading, formParams } = searchTableState;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);

  function fetchData(current = 1, pageSize = 10, params = {}) {
    const data = subscribeSList({
      page: current,
      page_size: pageSize,
      store_code,
      gb_code,
      subscribe_dm,
      subscribe_member,
    });
    dispatch({ type: UPDATE_LOADING, payload: { loading: true } });
    data.then((res) => {
      console.log(res);
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

  return (
    <div className={styles.container}>
      <Modal
        title="取消预约"
        footer={null}
        onCancel={() => {
          setcancelFormModal(false);
        }}
        style={{ width: 600 }}
        visible={cancelFormModal}
      >
        <CancelForm
          closeModalAndReqData={() => {
            setcancelFormModal(false);
            fetchData();
          }}
          clickitem={clickItem}
        ></CancelForm>
      </Modal>
      <Modal
        title="修改预约"
        footer={null}
        onCancel={() => {
          seteditFormModal(false);
        }}
        style={{ width: 600 }}
        visible={editFormModal}
      >
        <EditForm
          closeModalAndReqData={() => {
            seteditFormModal(false);
            fetchData();
          }}
          clickitem={clickItem}
        ></EditForm>
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>运营管理</Breadcrumb.Item>
        <Breadcrumb.Item>预约组局</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* <Button
              onClick={() => {
                // setvisitModal(true);
              }}
              disabled={true}
              type="primary"
            >
              添加会员
            </Button> */}
            <div>
              <Space>
                <Input
                  onChange={(e) => {
                    setstore_code(e);
                  }}
                  placeholder="请输入店铺"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setgb_code(e);
                  }}
                  placeholder="请输入剧本编码"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setsubscribe_dm(e);
                  }}
                  placeholder="请输入预约DM"
                  style={{ width: 200 }}
                />
                <Input
                  onChange={(e) => {
                    setsubscribe_member(e);
                  }}
                  placeholder="预定账号"
                  style={{ width: 200 }}
                />
                <Button
                  onClick={() => {
                    setstore_code('');
                    setgb_code('');
                    setsubscribe_dm('');
                    setsubscribe_member('');
                  }}
                >
                  重置
                </Button>
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
        <Typography.Paragraph>
          <Table
            rowKey="subscribe_id"
            loading={loading}
            onChange={onChangeTable}
            pagination={pagination}
            columns={columns}
            data={data}
          />
        </Typography.Paragraph>
      </Card>
    </div>
  );
}

export default SearchTable;
