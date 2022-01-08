import React, { useState, useRef } from 'react';
import { reqBindDm, reqBindrole } from '../../../api/drama.js';
import { Form, Space, Select, Message, Upload, Input, Button, Grid } from '@arco-design/web-react';
import { IconArrowRise, IconArrowFall, IconDelete } from '@arco-design/web-react/icon';
const Row = Grid.Row;
const Col = Grid.Col;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 17,
  },
};
const noLabelLayout = {
  wrapperCol: {
    span: 17,
    offset: 7,
  },
};
export default function DmForm({ clickItem, closeModalAndRequest, dmlist }) {
  const formRef = useRef();
  return (
    <div>
      <Form layout="vertical" ref={formRef} {...formItemLayout}>
        <Form.List field="role_array">
          {(fields, { add, remove, move }) => {
            return (
              <div>
                {fields.map((item, index) => {
                  return (
                    <div key={item.key}>
                      <Form.Item label={'角色' + (index + 1)}>
                        <Space>
                          <Row>
                            <Form.Item
                              label="角色名称"
                              field={item.field + '.role_name'}
                              rules={[{ required: true }]}
                              noStyle
                            >
                              <Input placeholder="角色名称" />
                            </Form.Item>
                          </Row>

                          <Form.Item
                            label="角色简介"
                            field={item.field + '.role_brief'}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input placeholder="角色简介" />
                          </Form.Item>
                          <Form.Item
                            label="角色备注"
                            field={item.field + '.role_remarks'}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input placeholder="角色备注" />
                          </Form.Item>
                          <Form.Item
                            label="是否凶手"
                            field={item.field + '.is_murderer'}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Select placeholder="是否凶手">
                              <Select.Option value={true}>是</Select.Option>
                              <Select.Option value={false}>否</Select.Option>
                            </Select>
                          </Form.Item>
                          <Form.Item
                            label="角色封面"
                            field={item.field + '.role_cover'}
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
                          ></Button>
                        </Space>
                      </Form.Item>
                    </div>
                  );
                })}
                <Form.Item wrapperCol={{ offset: 4 }}>
                  <Button
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
        <FormItem wrapperCol={{ offset: 4 }}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  await formRef.current.validate();
                  let param = await formRef.current.validate();
                  param.gb_code = clickItem.gb_code;
                  const data = await reqBindrole(param);
                  if (data.code === 200) {
                    Message.info('提交成功！');
                    closeModalAndRequest();
                  }
                } catch (_) {
                  // console.log(formRef.current.getFieldsError());
                  // Message.error('校验失败，请检查字段！');
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
      </Form>
    </div>
  );
}
