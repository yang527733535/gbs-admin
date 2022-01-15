import React, { useRef, useEffect, useState } from 'react';
import { IconArrowRise, IconArrowFall, IconDelete } from '@arco-design/web-react/icon';
import { Form, Input, Space, Button, Message, Upload, Modal, Select } from '@arco-design/web-react';
import { reqBindStaff, getUserList, reqEditRoom } from '../../../../api/drama.js';
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 17,
  },
};
const noLabelLayout = {
  wrapperCol: {
    span: 17,
    offset: 5,
  },
};

export default function RoomForm({ store_code, modalType, closeModal }) {
  const formRef = useRef();
  const [userList, setuserList] = useState([]);
  const [roleList, setroleList] = useState([]);
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    let data = await getUserList();
    setuserList(data.data);
  };

  // dicts
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('dicts'));
    data.forEach((element) => {
      if (element.dict_code === 'store_user_role') {
        setroleList(element.dict_label);
      }
    });
  }, []);

  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
  };
  return (
    <div>
      <Form ref={formRef} {...formItemLayout} onValuesChange={onValuesChange} scrollToFirstError>
        <Form.List field="user_array">
          {(fields, { add, remove, move }) => {
            return (
              <div>
                {fields.map((item, index) => {
                  return (
                    <div key={item.key}>
                      <Form.Item label={'店员' + (index + 1)}>
                        <Space>
                          <Form.Item
                            field={item.field + '.user_account'}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Select placeholder="请选择账号">
                              {userList?.map(({ user_account, user_name }) => {
                                return (
                                  <Select.Option key={user_account}>{user_name}</Select.Option>
                                );
                              })}
                            </Select>
                          </Form.Item>
                          <Form.Item
                            field={item.field + '.user_role'}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Select placeholder="请选择角色编码...">
                              {roleList?.map(({ label_zh, label_value }) => {
                                return <Select.Option key={label_value}>{label_zh}</Select.Option>;
                              })}
                            </Select>
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
                <Form.Item wrapperCol={{ offset: 5 }}>
                  <Button
                    onClick={() => {
                      add();
                    }}
                  >
                    添加店员
                  </Button>
                </Form.Item>
              </div>
            );
          }}
        </Form.List>

        {/* <Form.Item label="房间照片" field="room_image" triggerPropName="fileList">
          <Upload
            limit={1}
            renderUploadList={() => null}
            name="role_cover"
            customRequest={(option) => {
              const { onProgress, onError, onSuccess, file } = option;
              const xhr = new XMLHttpRequest();
              if (xhr.upload) {
                xhr.upload.onprogress = function(event) {
                  let percent;
                  if (event.total > 0) {
                    percent = (event.loaded / event.total) * 100;
                  }
                  onProgress(parseInt(percent, 10), event);
                };
              }
              xhr.onerror = function error(e) {
                onError(e);
              };
              xhr.onload = function onload() {
                if (xhr.status < 200 || xhr.status >= 300) {
                }
                let data = JSON.parse(xhr.responseText);
                setroomUrl(data.data.file_url);
                onSuccess(data);
              };
              const formData = new FormData();
              formData.append('up_file', file);
              formData.append('module', 'drama');
              xhr.open('post', 'https://gbs.toptian.com/system/upload/image', true);
              xhr.setRequestHeader('Authorization', localStorage.getItem('token'));
              xhr.send(formData);
            }}
            onPreview={(file) => {
              Modal.info({
                title: 'Preview',
                content: (
                  <img
                    src={file.url || URL.createObjectURL(file.originFile)}
                    style={{ maxWidth: '100%' }}
                  />
                ),
              });
            }}
          />
        </Form.Item> */}
        <FormItem {...noLabelLayout}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  await formRef.current.validate();
                  let param = formRef.current.getFields();
                  param.store_code = store_code;
                  console.log(param);
                  const res = await reqBindStaff(param);
                  if (res.code === 200) {
                    Message.info('修改成功！');
                    closeModal();
                  }
                } catch (_) {
                  console.log(_);
                  console.log(formRef.current.getFieldsError());
                  Message.error('校验失败，请检查字段！');
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
          {/* <Button
            type="text"
            onClick={() => {
              Message.info(`fields: ${formRef.current.getTouchedFields().join(',')}`);
            }}
          >
            Get touched fields
          </Button> */}
        </FormItem>
      </Form>
    </div>
  );
}
