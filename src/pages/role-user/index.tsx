import React, { useEffect, useState } from 'react';
import { Table, Tree, Button, Breadcrumb, Card, Modal } from '@arco-design/web-react';
import styles from './style/index.module.less';

function SearchTable({}) {
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
          <Button size="small" type="primary">
            修改
          </Button>
        );
      },
    },
  ];
  const [visitModal, setvisitModal] = useState(false);
  // const [menu_code] = useState('');
  // const [menu_status] = useState('');
  // const [menu_name] = useState('');
  // const [menu_path] = useState('');
  const [clickItem] = useState(null);
  const [tabledata] = useState([]);
  const [selectdict_code] = useState('');
  // const [parentMap, setparentMap] = useState({});
  useEffect(() => {}, []);

  return (
    <div className={styles.container}>
      <Modal
        title={clickItem === null ? '添加目录' : '修改字典'}
        footer={null}
        onCancel={() => {
          setvisitModal(false);
        }}
        unmountOnExit={true}
        style={{ width: 900, minWidth: 900 }}
        visible={visitModal}
      >
        {/* <AddForm
          selectdict_code={selectdict_code}
          clickItem={clickItem}
          closeModalAndReqTable={() => {
            setvisitModal(false);
            fetchData();
          }}
        ></AddForm> */}
      </Modal>
      <Breadcrumb style={{ marginBottom: 20 }}>
        <Breadcrumb.Item>系统设置</Breadcrumb.Item>
        <Breadcrumb.Item>字典管理</Breadcrumb.Item>
      </Breadcrumb>

      <div style={{ display: 'flex', width: '100%' }}>
        <div style={{ width: 200, marginRight: 20 }}>
          <Card>
            <Tree
              defaultSelectedKeys={['0-0-1']}
              treeData={[{ title: 'Branch 0-0-2', key: '0-0-2' }]}
            ></Tree>
          </Card>
        </div>
        <div style={{ flex: 1 }}>
          <Card style={{ height: '75vh', borderRadius: 4 }}>
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

export default SearchTable;
