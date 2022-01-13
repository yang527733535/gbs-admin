import React, { useRef, useEffect, useState } from 'react';
import {
  Form,
  Grid,
  Input,
  Select,
  Button,
  Message,
  InputNumber,
  Rate,
  Spin,
  Upload,
  DatePicker,
  Modal,
  Space,
} from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { addDrama, dramaDetail, editDrama } from '../../../api/drama.js';
import { ReducerState } from '../../../redux';
import { FormInstance } from '@arco-design/web-react/es/Form';
const FormItem = Form.Item;
const Row = Grid.Row;
const Col = Grid.Col;

function DramaForm({ modalType = 'add', closeModalAndRequest }) {
  // 初始化值为一个对象时

  const formRef = useRef<FormInstance>();
  const [loading, setloading] = useState(false);
  const [gb_typeSelectData, setgb_typeSelectData] = useState<any[]>([]);
  const [gb_levelSelectData, setgb_levelSelectData] = useState<any[]>([]);
  const [gb_text_tagSelectData, setgb_text_tagSelectData] = useState<any[]>([]);
  const [gb_status_Data, setgb_status_Data] = useState<any[]>([]);

  const dramaInfoStore = useSelector((state: ReducerState) => {
    return state.myState;
  });
  const { labelData, clickItem } = dramaInfoStore;
  useEffect(() => {
    if (modalType === 'edit') {
      initFormData();
    }
  }, []);

  const initFormData = async () => {
    setloading(true);
    const { data } = await dramaDetail({ gb_code: clickItem.gb_code });
    setloading(false);
    formRef.current.setFieldsValue({
      ...data,
      gb_cover: [
        {
          uid: '1',
          url: data.gb_cover,
          name: '20200717',
        },
      ],
    });
  };

  useEffect(() => {
    for (let index = 0; index < labelData.length; index++) {
      const element = labelData[index];
      if (element.dict_code === 'app_gb_type') {
        setgb_typeSelectData(element.dict_label);
      }
      if (element.dict_code === 'app_gb_level') {
        setgb_levelSelectData(element.dict_label);
      }

      if (element.dict_code === 'app_gb_text_tag') {
        setgb_text_tagSelectData(element.dict_label);
      }
      if (element.dict_code === 'app_gb_status') {
        setgb_status_Data(element.dict_label);
      }
      // "app_gb_status"
    }
  }, []);

  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
  };

  return (
    <Spin style={{ width: '100%' }} loading={loading}>
      <div>
        <Form ref={formRef} onValuesChange={onValuesChange} scrollToFirstError>
          <Row className="grid-demo" style={{ marginBottom: 10 }}>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="剧本名称"
                  field="gb_title"
                  rules={[{ required: true, message: '请填写剧本名称' }]}
                >
                  <Input placeholder="请填写剧本名称..." />
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="剧本类型"
                  field="gb_type"
                  rules={[{ required: true, message: '请填写剧本类型' }]}
                >
                  <Select placeholder="请选择剧本类型">
                    {gb_typeSelectData?.map((item) => {
                      return (
                        <Select.Option key={item.label_value} value={item.label_value}>
                          {item.label_zh}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                {' '}
                <FormItem
                  label="剧本难度"
                  field="gb_level"
                  rules={[{ required: true, message: '请选中剧本难度' }]}
                >
                  <Select placeholder="请选择剧本难度">
                    {gb_levelSelectData?.map((item) => {
                      return (
                        <Select.Option key={item.label_value} value={item.label_value}>
                          {item.label_zh}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="玩家人数"
                  field="gb_people"
                  rules={[{ required: true, message: '请填写玩家说明' }]}
                >
                  <InputNumber placeholder="请填写玩家说明..." />
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                {' '}
                <FormItem
                  label="剧本状态"
                  field="gb_status"
                  rules={[{ required: false, message: '请选择剧本状态' }]}
                >
                  <Select placeholder="请选择剧本状态">
                    {gb_status_Data?.map((item) => {
                      return (
                        <Select.Option key={item.label_value} value={item.label_value}>
                          {item.label_zh}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="玩家说明"
                  field="gb_people_note"
                  rules={[{ required: true, message: '请填写玩家说明' }]}
                >
                  <Input placeholder="请填写玩家说明..." />
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="剧本标签"
                  field="gb_text_tag_arr"
                  rules={[{ required: true, message: '请选择剧本标签' }]}
                >
                  <Select mode="multiple" allowClear placeholder="请选择剧本标签">
                    {gb_text_tagSelectData.map((item: any) => {
                      return (
                        <Select.Option key={item.label_value} value={item.label_value}>
                          {item.label_zh}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="剧本时长/小时"
                  field="gb_hour"
                  rules={[{ type: 'number', required: true }]}
                >
                  <InputNumber min={1} placeholder="请输入参考价格" />
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="工作日价格"
                  field="gb_price"
                  rules={[{ type: 'number', required: true }]}
                >
                  <InputNumber min={1} placeholder="请输入工作日价格" />
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="周末价格"
                  field="gb_price2"
                  rules={[{ type: 'number', required: true }]}
                >
                  <InputNumber min={1} placeholder="请输入工作日价格" />
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="推荐星级"
                  field="gb_star_lev"
                  rules={[
                    {
                      required: true,
                      type: 'number',
                    },
                  ]}
                >
                  <Rate allowHalf />
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="上架时间"
                  field="gb_add_time"
                  rules={[
                    {
                      required: false,
                      message: 'gb_add_time is required',
                    },
                  ]}
                >
                  <DatePicker showTime />
                </FormItem>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="剧本概要"
                  field="gb_text_brief"
                  rules={[{ required: true, message: '请填写剧本概要' }]}
                >
                  <Input.TextArea placeholder="请填写剧本概要..." />
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <div>
                <FormItem
                  label="剧本描述"
                  field="gb_text_content"
                  rules={[{ required: false, message: '请填写剧本描述' }]}
                >
                  <Input.TextArea placeholder="请填写剧本描述..." />
                </FormItem>
              </div>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <FormItem
                label="版权信息"
                field="gb_producer"
                rules={[{ required: true, message: '请填写版权信息' }]}
              >
                <Input.TextArea placeholder="请填写版权信息..." />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              {' '}
              <FormItem
                label="是否新本"
                field="is_new"
                rules={[{ required: false, message: '是否新本' }]}
              >
                <Select placeholder="是否新本">
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={0}>否</Select.Option>
                </Select>
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <FormItem
                label="是否热门"
                field="is_hot"
                rules={[{ required: false, message: '是否热门' }]}
              >
                <Select placeholder="是否热门">
                  <Select.Option value={1}>是</Select.Option>
                  <Select.Option value={0}>否</Select.Option>
                </Select>
              </FormItem>
            </Col>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <FormItem
                label="备注说明"
                field="gb_remarks"
                rules={[{ required: false, message: '请填写备注说明' }]}
              >
                <Input placeholder="请填写备注说明..." />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={12} md={12} lg={8} xl={8} xxl={8}>
              <Form.Item
                rules={[{ required: true, message: '请上传剧本封面' }]}
                label="剧本封面"
                field="gb_cover"
                triggerPropName="fileList"
              >
                <Upload
                  limit={1}
                  style={{ width: 200, height: 400 }}
                  // listType="picture-card"
                  name="gb_cover"
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
            <Col
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              span={24}
            >
              <div>
                <FormItem>
                  <Space>
                    {' '}
                    <Button
                      onClick={async () => {
                        if (formRef.current) {
                          try {
                            await formRef.current.validate();
                            const param = formRef.current.getFields();
                            param.gb_cover =
                              param.gb_cover[0].url || param.gb_cover[0].response.data.file_url;
                            if (modalType === 'edit') {
                              const data = await editDrama(param);
                              if (data.code === 200) {
                                Message.success('修改成功');
                                closeModalAndRequest();
                              }
                              return;
                            }
                            param.gb_star_lev = param.gb_star_lev * 2;
                            const data = await addDrama(param);
                            if (data.code === 200) {
                              Message.success('添加成功');
                              closeModalAndRequest();
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

export default DramaForm;
