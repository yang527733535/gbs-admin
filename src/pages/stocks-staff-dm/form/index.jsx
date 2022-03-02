import React, { useState, useEffect } from 'react';
import {
  Form,
  Image,
  Input,
  Upload,
  DatePicker,
  Button,
  Select,
  InputNumber,
  Modal,
  Message,
} from '@arco-design/web-react';
import { bindDm } from '../../../api/drama.js';
import { imguploadurl } from '../../../../.config/config.js';

const noLabelLayout = {
  wrapperCol: {
    span: 17,
    offset: 5,
  },
};
const FormItem = Form.Item;
function Index({ UserList, ClickItem = null, closeModalAndReqNewTableData }) {
  const [form] = Form.useForm();
  const [dmUrl, setdmUrl] = useState();
  useEffect(() => {
    // effect
    if (ClickItem) {
      setdmUrl(ClickItem.user_photo);
      form.setFieldsValue({
        ...ClickItem,
      });
    }
  }, []);
  return (
    <div>
      <Form
        onSubmit={(v) => {
          Message.success('success');
        }}
        form={form}
      >
        <FormItem
          rules={[{ required: true, message: '请选择账号' }]}
          field="user_account"
          label="选择账号"
        >
          <Select placeholder="请选择账号">
            {UserList?.map((item) => {
              return <Select.Option key={item.user_account}>{item.user_account}</Select.Option>;
            })}
          </Select>
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请输入昵称' }]}
          field="user_nick"
          label="昵称"
        >
          <Input placeholder="请输入昵称"></Input>
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请输入星座' }]}
          field="star_sign"
          label="星座"
        >
          <Input placeholder="请输入星座"></Input>
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请输入DM简介' }]}
          field="user_brief"
          label="DM简介"
        >
          <Input.TextArea placeholder="请输入DM简介"></Input.TextArea>
        </FormItem>

        <FormItem
          rules={[{ required: true, message: '请选择性别' }]}
          field="user_gender"
          label="性别"
        >
          <Select>
            <Select.Option value="0">未知</Select.Option>
            <Select.Option value="1">男</Select.Option>
            <Select.Option value="2">女</Select.Option>
          </Select>
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请输入获赞次数' }]}
          field="praise_qty"
          label="获赞次数"
        >
          <InputNumber></InputNumber>
        </FormItem>
        <FormItem
          rules={[{ required: true, message: '请输入带场次数' }]}
          field="exp_value"
          label="带场次数"
        >
          <InputNumber></InputNumber>
        </FormItem>
        <FormItem
          label="加入时间"
          field="join_date"
          rules={[
            {
              required: true,
              message: 'join_date is required',
            },
          ]}
        >
          <DatePicker showTime />
        </FormItem>
        <Form.Item
          rules={[
            {
              required: false,
              message: '请上传dm照片',
            },
          ]}
          label="dm照片"
          field="room_image"
          triggerPropName="fileList"
        >
          <Upload
            limit={2}
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
                let resdata = JSON.parse(xhr.responseText);
                if (resdata.code !== 200) {
                  Message.error(resdata.message);
                }
                console.log('resdata: ', resdata);
                if (xhr.status < 200 || xhr.status >= 300) {
                }
                const data = JSON.parse(xhr.responseText);
                setdmUrl(data.data.file_url);
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
                  <Image
                    src={file.url || URL.createObjectURL(file.originFile)}
                    style={{ maxWidth: '100%' }}
                  />
                ),
              });
            }}
          />
        </Form.Item>
        {dmUrl === '' ? null : (
          <Form.Item {...noLabelLayout}>
            <Image width={212} height={300} src={dmUrl} alt="" />
          </Form.Item>
        )}
        {/* <Form.Item
          rules={[{ required: true, message: '请上传DM相片' }]}
          label="DM相片"
          field="user_photo"
          triggerPropName="fileList"
        >
          <Upload
            limit={1}
            listType="picture-card"
            name="user_photo"
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
                onSuccess(JSON.parse(xhr.responseText));
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
                title: '预览',
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
        <FormItem
          wrapperCol={{
            offset: 5,
          }}
        >
          <Button
            onClick={async () => {
              const param = form.getFields();
              param.user_photo = dmUrl;
              const data = await bindDm(param);
              if (data.code === 200) {
                closeModalAndReqNewTableData();
              }
            }}
            type="primary"
          >
            Submit
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

export default Index;
