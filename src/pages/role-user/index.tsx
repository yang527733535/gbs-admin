import React, { useEffect, useState } from 'react';
import { Table, Tree, Button, Breadcrumb, Card, Modal, Space } from '@arco-design/web-react';
import styles from './style/index.module.less';
import { RoleTreeApi, userList } from '../../api/user.js';
import AddForm from './form/index.jsx';

function RoleTree({}) {
  const columns = [
    {
      title: '名称',
      dataIndex: 'label_zh',
    },
    {
      title: '字典编码',
      dataIndex: 'dict_code',
    },
    {
      title: '操作',
      render: () => {
        return (
          <Space>
            <Button size="small" type="primary">
              修改
            </Button>
            <Button status="danger" size="small" type="primary">
              删除
            </Button>
          </Space>
        );
      },
    },
  ];
  const [visitModal, setvisitModal] = useState(false);
  const [clickItem] = useState(null);
  const [tabledata] = useState([]);
  const [selectdict_code] = useState('');
  const [treeData, settreeData] = useState([]);
  const [userListData, setuserListData] = useState([]);
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
        unmountOnExit={true}
        style={{ width: 900, minWidth: 900 }}
        visible={visitModal}
      >
        <AddForm
          userListData={userListData}
          selectdict_code={selectdict_code}
          clickItem={clickItem}
          closeModalAndReqTable={() => {
            setvisitModal(false);
            // fetchData();
          }}
        ></AddForm>
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>权限管理</Breadcrumb.Item>
        <Breadcrumb.Item>角色分配</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: 200, marginRight: 20 }}>
          <Card>
            <Tree
              // defaultSelectedKeys={['0-0-1']}
              treeData={treeData}
            ></Tree>
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
              showHeader={true}
              // stripe={true}
              hover={true}
              columns={columns}
              data={tabledata}
            ></Table>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RoleTree;
