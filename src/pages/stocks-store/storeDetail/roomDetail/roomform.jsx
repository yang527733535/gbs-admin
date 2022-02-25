import React, { useRef, useEffect, useState } from 'react';

import { Form, Select, Input, Button, Message, Upload, Modal } from '@arco-design/web-react';
import { reqBindRoom, reqEditRoom } from '../../../../api/drama.js';
import { imguploadurl } from '../../../../../.config/config.js';

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

export default function RoomForm({ saveClickItem, store_code, modalType, closeModal }) {
  const formRef = useRef();
  const [roomUrl, setroomUrl] = useState('');
  const [app_room_styleList, setapp_room_styleList] = useState([]);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('dicts'));
    data.forEach((element) => {
      if (element.dict_code === 'app_room_style') {
        setapp_room_styleList(element.dict_label);
      }
    });
  }, []);

  useEffect(() => {
    if (modalType === 'edit') {
      formRef.current.setFieldsValue(saveClickItem);
      setroomUrl(saveClickItem.room_image);
    }
  }, []);

  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
  };
  return (
    <div>
      <Form ref={formRef} {...formItemLayout} onValuesChange={onValuesChange} scrollToFirstError>
        <FormItem
          label="房间名称"
          field="room_name"
          rules={[{ required: true, message: '请输入房间名称' }]}
        >
          <Input placeholder="请输入房间名称" />
        </FormItem>
        <FormItem
          label="房间风格"
          field="room_style"
          rules={[{ required: true, message: '请选择房间风格' }]}
        >
          <Select>
            {app_room_styleList?.map(({ label_value, label_zh }) => {
              return <Select.Option value={label_value}>{label_zh}</Select.Option>;
            })}
          </Select>
        </FormItem>

        <FormItem
          label="房间备注"
          field="room_note"
          rules={[{ required: true, message: '请输入房间备注' }]}
        >
          <Input placeholder="请输入房间备注" />
        </FormItem>

        <Form.Item label="房间照片" field="room_image" triggerPropName="fileList">
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
              xhr.open('post', `${imguploadurl}/system/upload/image`, true);
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
        </Form.Item>
        {roomUrl === '' ? null : (
          <Form.Item {...noLabelLayout}>
            <img style={{ width: 212, height: 300 }} src={roomUrl} alt="" />
          </Form.Item>
        )}

        <FormItem {...noLabelLayout}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  await formRef.current.validate();
                  let param = formRef.current.getFields();
                  param.room_image = roomUrl;
                  param.store_code = store_code;
                  console.log(param);
                  if (modalType === 'add') {
                    const res = await reqBindRoom(param);
                    if (res.code === 200) {
                      Message.info('提交成功！');
                      closeModal();
                    }
                  }
                  if (modalType === 'edit') {
                    const res = await reqEditRoom(param);
                    if (res.code === 200) {
                      Message.info('修改成功！');
                      closeModal();
                    }
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
