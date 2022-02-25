import React, { useEffect, useState } from 'react';
import { Message, Tree, Button, Breadcrumb, Card, Modal } from '@arco-design/web-react';
import styles from './style/index.module.less';
import {
  RoleTreeApi,
  reqgetallmune,
  reqmenusave,
  userList,
  reqGetroleMuen,
} from '../../api/user.js';
import AddForm from './form/index.jsx';

const allExpandedKeys = ['shop_leading'];
function RoleTree({}) {
  const [expandedKeys, setExpandedKeys] = useState(allExpandedKeys);
  const [mTreeData, setmTreeData] = useState([]);
  const [cardloading, setcardloading] = useState(false);
  const [visitModal, setvisitModal] = useState(false);
  const [clickItem] = useState(null);

  const [selectdict_code] = useState('');
  const [treeData, settreeData] = useState([]);
  const [userListData, setuserListData] = useState([]);
  const [nowrole_code, setnowrole_code] = useState('shop_dm');
  const [checkedKeys, setCheckedKeys] = useState([]);
  useEffect(() => {
    getallmune();
  }, []);
  const getallmune = async () => {
    let { data } = await reqgetallmune();
    console.log('resdata: ', data);
    setmTreeData(data);
  };
  useEffect(() => {
    getRoleMuenList();
  }, [nowrole_code]);
  const getRoleMuenList = async () => {
    let param = {
      role_code: nowrole_code,
    };
    setcardloading(true);
    const { data } = await reqGetroleMuen(param);
    setCheckedKeys(data);
    setcardloading(false);
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
            getRoleMuenList();
          }}
        />
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>权限管理</Breadcrumb.Item>
        <Breadcrumb.Item>角色授权</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: 200, marginRight: 20 }}>
          <Card>
            {treeData && (
              <Tree
                onSelect={async (e) => {
                  setnowrole_code(e[0]);
                }}
                expandedKeys={expandedKeys}
                onExpand={(keys, extra) => {
                  console.log(keys, extra);
                  setExpandedKeys(keys);
                }}
                // expandedKeys={['shop_person', 'shop_dm']}
                treeData={treeData}
              />
            )}
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Card
            loading={cardloading}
            title="绑定角色菜单"
            // style={{ height: '75vh', borderRadius: 4 }}
          >
            <Tree
              autoExpandParent={true}
              // checkStrictly={checkStrictly}

              checkable
              checkedKeys={checkedKeys}
              onCheck={(value) => {
                console.log('value: ', value);
                setCheckedKeys(value);
              }}
              treeData={mTreeData}
            ></Tree>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button
                onClick={async () => {
                  let param = {
                    role_code: nowrole_code,
                    menu_code_arr: checkedKeys,
                  };
                  let resdata = await reqmenusave(param);
                  if (resdata.code === 200) {
                    getRoleMuenList();
                    Message.success('保存成功');
                  }
                }}
                style={{ marginTop: 10 }}
                type="primary"
              >
                保存
              </Button>
            </div>

            {/* <Button
              onClick={() => {
                setvisitModal(true);
              }}
              style={{ marginBottom: 20 }}
              type="primary"
            >
              角色添加用户
            </Button> */}
            {/* <Table
              showHeader
              // stripe={true}
              hover
              columns={columns}
              data={tabledata}
            /> */}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default RoleTree;
