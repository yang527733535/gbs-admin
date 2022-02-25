import React, { useEffect, useState } from 'react';
import {
  Table,
  Message,
  Popconfirm,
  Tree,
  Button,
  Breadcrumb,
  Card,
  Modal,
  Space,
} from '@arco-design/web-react';
import styles from './style/index.module.less';
import { RoleTreeApi, deleteRoleUser, userList, reqGetroleUser } from '../../api/user.js';
import AddForm from './form/index.jsx';

function RoleTree({}) {
  const columns = [
    {
      title: '帐号',
      dataIndex: 'user_account',
    },
    {
      title: '用户id',
      dataIndex: 'user_id',
    },
    {
      title: '用户名',
      dataIndex: 'user_name',
    },
    {
      title: '英语名称',
      dataIndex: 'user_name_en',
    },
    {
      title: '昵称',
      dataIndex: 'user_nick',
    },
    {
      title: '操作',
      render: (_, data) => {
        return (
          <Space>
            <Popconfirm
              title="确定删除该用户?"
              onOk={async () => {
                const { user_id, user_account } = data;
                let param = {
                  role_code: nowrole_code,
                  user_id,
                  user_account,
                };
                console.log('param', param);
                let resdata = await deleteRoleUser(param);
                console.log('data: ', data);
                if (resdata.code === 200) {
                  Message.info({ content: '删除成功' });
                  getRoleUserList();
                }
              }}
              onCancel={() => {
                Message.error({ content: 'cancel' });
                console.log(data);
              }}
            >
              <Button
                onChange={() => {
                  console.log(data);
                }}
                status="danger"
                size="mini"
                type="primary"
              >
                删除用户
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const [visitModal, setvisitModal] = useState(false);
  const [clickItem] = useState(null);
  const [selectdict_code] = useState('');
  const [treeData, settreeData] = useState([]);
  const [userListData, setuserListData] = useState([]);
  const [nowrole_code, setnowrole_code] = useState('');
  const [tabledata, settabledata] = useState([]);
  useEffect(() => {
    getRoleUserList();
  }, [nowrole_code]);
  const getRoleUserList = async () => {
    let param = {
      role_code: nowrole_code,
    };
    const { data } = await reqGetroleUser(param);
    settabledata(data);
    console.log('data: ', data);
  };

  useEffect(() => {
    reqRoleTree();
  }, []);
  useEffect(() => {
    reqUserList();
  }, []);
  const reqUserList = async () => {
    const parma = {
      page: 1,
      page_size: 100,
    };
    const { data } = await userList(parma);
    setuserListData(data);
  };

  const reqRoleTree = async () => {
    const resdata = await RoleTreeApi();
    const { data } = resdata;
    const mapTree = (org) => {
      const haveChildren = Array.isArray(org.role_child) && org.role_child.length > 0;
      return {
        title: String(org.role_name),
        key: String(org.role_code),
        children: haveChildren ? org.role_child.map((i) => mapTree(i)) : [],
      };
    };
    let arr = [];
    arr = data.map((org) => mapTree(org));
    settreeData(arr);
  };
  return (
    <div className={styles.container}>
      <Modal
        title={clickItem === null ? '添加用户' : '修改用户'}
        footer={null}
        onCancel={() => {
          setvisitModal(false);
        }}
        unmountOnExit
        style={{ width: 900, minWidth: 900 }}
        visible={visitModal}
      >
        <AddForm
          nowrole_code={nowrole_code}
          userListData={userListData}
          selectdict_code={selectdict_code}
          clickItem={clickItem}
          closeModalAndReqTable={() => {
            setvisitModal(false);
            getRoleUserList();
          }}
        />
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>权限管理</Breadcrumb.Item>
        <Breadcrumb.Item>角色分配</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: 200, marginRight: 20 }}>
          <Card>
            <Tree
              onSelect={async (e) => {
                setnowrole_code(e[0]);
              }}
              // defaultSelectedKeys={['0-0-1']}
              treeData={treeData}
            />
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Card style={{ height: '75vh', borderRadius: 4 }}>
            <Button
              onClick={() => {
                setvisitModal(true);
              }}
              style={{ marginBottom: 20 }}
              type="primary"
            >
              角色添加用户
            </Button>
            <div>
              {selectdict_code !== '' && (
                <Button
                  onClick={() => {
                    setvisitModal(true);
                  }}
                  style={{ marginBottom: 20 }}
                  type="primary"
                >
                  添加字典
                </Button>
              )}
            </div>
            <Table
              showHeader
              // stripe={true}
              hover
              columns={columns}
              data={tabledata}
            />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RoleTree;
