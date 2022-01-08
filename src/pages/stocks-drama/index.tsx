import React, { useEffect, useState } from 'react';
import {
  Table,
  Typography,
  Button,
  Input,
  Breadcrumb,
  Card,
  Space,
  Modal,
} from '@arco-design/web-react';
import { useSelector, useDispatch } from 'react-redux';
import { dramaList, labelsApi, getDmList } from '../../api/drama.js';
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
import DmForm from './dmform/index.jsx';
import AddRoleForm from './addRoleForm/index.jsx';

function SearchTable() {
  const locale = useLocale();
  const [dmlist, setdmlist] = useState([]);
  const [clickItem, setclickItem] = useState({});
  const [addDmModal, setaddDmModal] = useState(false);
  const [visitModal, setvisitModal] = useState(false);
  const [DramaRoleModal, setDramaRoleModal] = useState(false);
  const [labelData, setlabelData] = useState([]);
  const columns = [
    {
      title: '剧本ID',
      dataIndex: 'gb_id',
    },
    {
      title: '剧本标题',
      dataIndex: 'gb_title',
    },
    {
      title: '剧本类型',
      dataIndex: 'gb_type',
      render: (value) => <Typography.Text copyable>{value}</Typography.Text>,
    },
    {
      title: '剧本区域',
      dataIndex: 'gb_area',
    },
    {
      title: '剧本封面',
      dataIndex: 'gb_cover',
      render: (_, element) => {
        return <img style={{ width: 60, height: 90 }} src={element.gb_cover}></img>;
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
      dataIndex: 'operations',
      render: (_, data) => (
        <div className={styles.operations}>
          <Space>
            <Button
              onClick={() => {
                setDramaRoleModal(true);
                setclickItem(data);
              }}
              type="primary"
              size="mini"
            >
              添加角色
            </Button>
            <Button
              onClick={() => {
                setclickItem(data);
                setaddDmModal(true);
              }}
              type="primary"
              size="mini"
            >
              添加dm
            </Button>
            <Button type="primary" size="mini">
              {locale['searchTable.columns.operations.update']}
            </Button>
          </Space>

          {/* <Button type="text" status="danger" size="small">
            {locale['searchTable.columns.operations.delete']}
          </Button> */}
        </div>
      ),
    },
  ];
  const searchTableState = useSelector((state: ReducerState) => state.searchTable);
  const { data, pagination, loading, formParams } = searchTableState;
  const dispatch = useDispatch();
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    getlabelsApi();
    getDmListApi();
  }, []);
  const getlabelsApi = async () => {
    const data = await labelsApi();
    setlabelData(data.data);
  };

  const getDmListApi = async () => {
    const data = await getDmList();
    console.log('data: ', data);
    setdmlist(data.data);
  };

  function fetchData(current = 1, pageSize = 10, params = {}) {
    const data = dramaList({
      page: current,
      page_size: pageSize,
    });
    data.then((res) => {
      console.log(res);
      const { data, paginator } = res;
      dispatch({ type: UPDATE_LIST, payload: { data: data } });
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
      {/* DramaRoleModal */}
      <Modal
        style={{ width: 800 }}
        unmountOnExit={true}
        footer={null}
        title="添加角色"
        visible={DramaRoleModal}
        onCancel={() => {
          setDramaRoleModal(false);
        }}
      >
        <AddRoleForm clickItem={clickItem}></AddRoleForm>
      </Modal>
      <Modal
        onCancel={() => {
          setaddDmModal(false);
        }}
        visible={addDmModal}
        unmountOnExit={true}
        footer={null}
        title="添加dm"
      >
        <DmForm
          closeModalAndRequest={() => {
            fetchData();
            setaddDmModal(false);
          }}
          dmlist={dmlist}
          clickItem={clickItem}
        ></DmForm>
      </Modal>
      <Modal
        title="添加剧本"
        footer={null}
        onCancel={() => {
          setvisitModal(false);
        }}
        unmountOnExit={true}
        style={{ width: 900, minWidth: 900 }}
        visible={visitModal}
      >
        <AddForm
          closeModalAndRequest={() => {
            fetchData();
            setvisitModal(false);
          }}
          labelData={labelData}
        ></AddForm>
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>运营管理</Breadcrumb.Item>
        <Breadcrumb.Item>剧本管理</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              style={{ marginRight: 20 }}
              onClick={() => {
                setvisitModal(true);
              }}
              type="primary"
            >
              添加剧本
            </Button>
            <div>
              <Space style={{ flex: 1 }} wrap>
                <Input
                  onChange={() => {}}
                  placeholder="请输入剧本标题"
                  style={{ width: 200 }}
                ></Input>
                <Input onChange={() => {}} placeholder="剧本类型" style={{ width: 200 }}></Input>
                <Input onChange={() => {}} placeholder="剧本区域" style={{ width: 200 }}></Input>
                <Input onChange={() => {}} placeholder="玩家人数" style={{ width: 200 }}></Input>
                <Input onChange={() => {}} placeholder="剧本状态" style={{ width: 200 }}></Input>
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
          rowKey="gb_id"
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
