import React, { useRef, useState, useEffect } from 'react';
import styles from './styles/index.module.less';
import xiongshou from './styles/xiongshou.png';
import {
  Form,
  Space,
  Modal,
  Select,
  Message,
  Input,
  Button,
  Grid,
  Card,
  Result,
  Popconfirm,
  Typography,
  Tooltip,
} from '@arco-design/web-react';
import { IconDelete, IconUserAdd } from '@arco-design/web-react/icon';
import { useSelector } from 'react-redux';
import { reqBindrole, reqDeleteBindrole } from '../../../../api/drama.js';
import { ReducerState } from '../../../../redux/index';
import { FormInstance } from '@arco-design/web-react/es/Form';
import AddRoleDetailForm from './AddRoleDetailForm/index';
const Row = Grid.Row;
const Col = Grid.Col;
const FormItem = Form.Item;
const { Meta } = Card;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 17,
  },
};

export default function DmForm({ getInitFormData, role_array }) {
  const formRef = useRef<FormInstance>();

  const dramaInfoStore = useSelector((state: ReducerState) => {
    return state.myState;
  });
  useEffect(() => {
    formRef.current.setFieldsValue({ role_array });
  }, [role_array]);
  const [saveDeleteItem, setsaveDeleteItem] = useState<any>();
  const [saveEditItem, setsaveEditItem] = useState<any>();
  const [modalType, setmodalType] = useState<string>('');
  const { clickItem } = dramaInfoStore;
  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
  };
  const [addRoleToDramaModal, setaddRoleToDramaModal] = useState<boolean>(false);

  return (
    <>
      <Modal
        onCancel={() => {
          setaddRoleToDramaModal(false);
        }}
        title={modalType === 'add' ? '添加角色' : '修改角色'}
        visible={addRoleToDramaModal}
        footer={null}
        unmountOnExit
      >
        <AddRoleDetailForm
          getInitFormData={getInitFormData}
          saveEditItem={saveEditItem}
          modalType={modalType}
          closeModal={() => {
            setaddRoleToDramaModal(false);
          }}
          role_array={role_array}
          clickItem={clickItem}
        ></AddRoleDetailForm>
      </Modal>

      {role_array.length === 0 && <Result status="404" subTitle="该剧本还没有角色喔"></Result>}

      <Row gutter={40} style={{ display: 'flex', padding: 20 }}>
        <div
          onClick={() => {
            setaddRoleToDramaModal(true);
            setmodalType('add');
          }}
          style={{ marginRight: 20, marginBottom: 20 }}
          className={styles.myadd}
        >
          <IconUserAdd style={{ fontSize: 50 }} type="primary">
            添加角色
          </IconUserAdd>
          <div>添加角色</div>
        </div>
        {role_array.map((item) => {
          return (
            <div style={{ position: 'relative' }}>
              {item.is_murderer === '1' && (
                <div>
                  <img
                    style={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 999,
                      width: 30,
                      height: 30,
                    }}
                    src={xiongshou}
                    alt=""
                  />
                </div>
              )}
              <Card
                key={item.role_code}
                className={styles.Meta}
                hoverable
                style={{ width: 212, maxHeight: 505, marginRight: 20, marginBottom: 20 }}
                cover={
                  <div
                    style={{
                      height: 300,
                    }}
                  >
                    <img
                      style={{ width: '100%', height: '100%' }}
                      alt="dessert"
                      src={item.role_cover}
                    />
                  </div>
                }
              >
                <Meta
                  title={<span style={{}}>{item.role_name}</span>}
                  description={
                    <>
                      <Tooltip content={item.role_brief}>
                        <Typography.Paragraph ellipsis={true} style={{ width: '100%' }}>
                          {item.role_brief}
                        </Typography.Paragraph>
                      </Tooltip>
                      <Space style={{ marginLeft: 15 }}>
                        <Button
                          onClick={() => {
                            setmodalType('edit');
                            setsaveEditItem(item);
                            setaddRoleToDramaModal(true);
                          }}
                          size="mini"
                          type="primary"
                        >
                          修改角色
                        </Button>
                        <Popconfirm
                          title="确定删除这个角色?"
                          onOk={async () => {
                            let newrole_array = role_array.filter((item) => {
                              return saveDeleteItem.role_code === item.role_code;
                            });
                            const param = {
                              gb_code: clickItem.gb_code,
                              role_array: newrole_array,
                            };
                            const data = await reqDeleteBindrole(param);
                            if (data.code === 200) {
                              Message.success('删除成功');
                              getInitFormData();
                            }
                          }}
                          onCancel={() => {}}
                        >
                          <Button
                            size="mini"
                            onClick={() => {
                              setsaveDeleteItem(item);
                            }}
                            status="danger"
                          >
                            删除角色
                          </Button>
                        </Popconfirm>
                      </Space>
                    </>
                  }
                />
              </Card>
            </div>
          );
        })}
      </Row>
      <Form
        style={{ display: 'none' }}
        onValuesChange={onValuesChange}
        layout="vertical"
        ref={formRef}
        {...formItemLayout}
      >
        <Form.List field="role_array">
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((item, index) => {
                  return (
                    <div key={item.key}>
                      <Form.Item label={`角色${index + 1}`}>
                        <Space>
                          <Row>
                            <Form.Item
                              label="角色名称"
                              field={`${item.field}.role_name`}
                              rules={[{ required: true }]}
                              noStyle
                            >
                              <Input placeholder="角色名称" />
                            </Form.Item>
                          </Row>

                          <Form.Item
                            label="角色简介"
                            field={`${item.field}.role_brief`}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input placeholder="角色简介" />
                          </Form.Item>
                          <Form.Item
                            label="角色备注"
                            field={`${item.field}.role_remarks`}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input placeholder="角色备注" />
                          </Form.Item>
                          <Form.Item
                            label="是否凶手"
                            field={`${item.field}.is_murderer`}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Select placeholder="是否凶手">
                              <Select.Option value="1">是</Select.Option>
                              <Select.Option value="0">否</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            label="角色封面"
                            field={`${item.field}.role_cover`}
                            rules={[{ required: true }]}
                            noStyle
                            // initialValue={[
                            //   {
                            //     uid: '-1',
                            //     url:
                            //       '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
                            //     name: '20200717',
                            //   },
                            // ]}
                          >
                            <Input placeholder="角色封面" />
                            {/* <Upload
                              listType="picture-card"
                              multiple
                              name="files"
                              action="/"
                              onPreview={(file) => {
                                Modal.info({
                                  title: 'Preview',
                                  content: (
                                    <img
                                      src={file.url || URL.createObjectURL(file.originFile)}
                                      style={{ maxWidth: '100%' }}
                                    ></img>
                                  ),
                                });
                              }}
                            /> */}
                          </Form.Item>
                          <Button
                            icon={<IconDelete />}
                            shape="circle"
                            status="danger"
                            onClick={() => remove(index)}
                          />
                        </Space>
                      </Form.Item>
                    </div>
                  );
                })}
                <Form.Item>
                  <Button
                    type="primary"
                    onClick={() => {
                      add();
                    }}
                  >
                    添加角色
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>
        <Row style={{ width: '100%' }}>
          <Col span={24}>
            <FormItem style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Space>
                <Button
                  onClick={async () => {
                    if (formRef.current) {
                      try {
                        await formRef.current.validate();
                        const param = await formRef.current.validate();
                        param.gb_code = clickItem.gb_code;
                        const data = await reqBindrole(param);
                        if (data.code === 200) {
                          Message.info('提交成功！');
                        }
                      } catch (_) {
                        // Message.error('校验失败，请检查字段！');
                      }
                    }
                  }}
                  type="primary"
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
              </Space>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </>
  );
}
