import React, { useRef } from 'react';
import {
  Form,
  Grid,
  Input,
  Select,
  Button,
  Message,
  Spin,
  Upload,
  Modal,
  Space,
} from '@arco-design/web-react';
import { reqBindrole } from '../../../../../api/drama.js';

import { FormInstance } from '@arco-design/web-react/es/Form';
const FormItem = Form.Item;
const Row = Grid.Row;
const Col = Grid.Col;

function DramaRoleForm({ clickItem, closeModal, role_array }) {
  console.log('clickItem: ', clickItem);
  // 初始化值为一个对象时

  const formRef = useRef<FormInstance>();
  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
  };

  return (
    <Spin style={{ width: '100%' }}>
      <div>
        <Form ref={formRef} onValuesChange={onValuesChange} scrollToFirstError>
          <Row className="grid-demo" style={{ marginBottom: 10 }}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <div>
                <FormItem
                  label="角色名称"
                  field="role_name"
                  rules={[{ required: true, message: '请填写角色名称' }]}
                >
                  <Input placeholder="请填写角色名称..." />
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <div>
                <FormItem
                  label="角色简介"
                  field="role_brief"
                  rules={[{ required: true, message: '请填写角色简介' }]}
                >
                  <Input placeholder="请填写角色简介..." />
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <div>
                <FormItem
                  label="是否凶手"
                  field="is_murderer"
                  rules={[{ required: false, message: '请选择是否凶手' }]}
                >
                  <Select placeholder="请选择是否凶手">
                    <Select.Option value="1">是</Select.Option>
                    <Select.Option value="0">否</Select.Option>
                  </Select>
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <div>
                <FormItem
                  label="角色备注"
                  field="role_remarks"
                  rules={[{ required: false, message: '请填写角色备注' }]}
                >
                  <Input placeholder="请填写角色备注..." />
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <Form.Item
                rules={[{ required: true, message: '请上传角色封面' }]}
                label="角色封面"
                field="role_cover"
                triggerPropName="fileList"
              >
                <Upload
                  limit={1}
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
                        // return onError(xhr.responseText);
                      }
                      onSuccess(JSON.parse(xhr.responseText));
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
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div>
                <FormItem>
                  <Space>
                    <Button
                      onClick={async () => {
                        if (formRef.current) {
                          try {
                            await formRef.current.validate();
                            const param = formRef.current.getFields();
                            param.role_cover =
                              param.role_cover[0].url || param.role_cover[0].response.data.file_url;

                            role_array.push(param);
                            let param2: any = {};
                            param2.role_array = role_array;
                            param2.gb_code = clickItem.gb_code;
                            const data = await reqBindrole(param2);
                            if (data.code === 200) {
                              Message.success('修改成功');
                              closeModal();
                            }
                          } catch (_) {
                            Message.error('校验失败，请检查字段！');
                          }
                        }
                      }}
                      type="primary"
                      // style={{ marginRight: 24 }}
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
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </Spin>
  );
}

export default DramaRoleForm;
