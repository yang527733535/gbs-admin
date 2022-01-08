import React, { useRef, useEffect, useState } from 'react';
import {
  Form,
  AutoComplete,
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
} from '@arco-design/web-react';
import { addDrama, dramaDetail, editDrama } from '../../../api/drama.js';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7,
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

function DramaForm({ labelData, clickItem, modalType, closeModalAndRequest }) {
  const formRef = useRef();
  const [ImgData, setImgData] = useState(null);
  const [loading, setloading] = useState(false);
  const [size, setSize] = useState('default');
  const [gb_typeSelectData, setgb_typeSelectData] = useState([]);
  const [gb_levelSelectData, setgb_levelSelectData] = useState([]);
  const [gb_peopleSelectData, setgb_peopleSelectData] = useState([]);
  const [gb_text_tagSelectData, setgb_text_tagSelectData] = useState([]);
  const [gb_status_Data, setgb_status_Data] = useState([]);
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
        setgb_typeSelectData(element);
      }
      if (element.dict_code === 'app_gb_level') {
        setgb_levelSelectData(element);
      }
      if (element.dict_code === 'app_gb_people') {
        setgb_peopleSelectData(element);
      }
      if (element.dict_code === 'app_gb_text_tag') {
        setgb_text_tagSelectData(element);
      }
      if (element.dict_code === 'app_gb_status') {
        setgb_status_Data(element);
      }
      // "app_gb_status"
    }
  }, []);

  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
  };

  return (
    <Spin style={{ width: '100%' }} loading={loading}>
      <div style={{ maxWidth: 650 }}>
        <Form
          ref={formRef}
          {...formItemLayout}
          size={size}
          onSubmit={(e) => {
            // const param = {
            //   ...e,
            //   gb_cover: e.gb_cover['response']['data']['file_url'],
            // };
            console.log(param);
          }}
          onValuesChange={onValuesChange}
          scrollToFirstError
        >
          <FormItem
            label="剧本名称"
            field="gb_title"
            rules={[{ required: true, message: '请填写剧本名称' }]}
          >
            <Input placeholder="请填写剧本名称..." />
          </FormItem>
          <Form.Item
            rules={[{ required: true, message: '请上传剧本封面' }]}
            label="剧本封面"
            field="gb_cover"
            triggerPropName="fileList"
          >
            <Upload
              limit={1}
              listType="picture-card"
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
                    return onError(xhr.responseText);
                  }
                  setImgData(JSON.parse(xhr.responseText));
                  onSuccess(JSON.parse(xhr.responseText), xhr);
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
                    ></img>
                  ),
                });
              }}
            />
          </Form.Item>
          <FormItem
            label="剧本类型"
            field="gb_type"
            rules={[{ required: true, message: '请填写剧本类型' }]}
          >
            <Select placeholder="请选择剧本类型">
              {gb_typeSelectData?.dict_label?.map((item) => {
                return (
                  <Select.Option key={item.label_value} value={item.label_value}>
                    {item.label_zh}
                  </Select.Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
            label="剧本难度"
            field="gb_level"
            rules={[{ required: true, message: '请选中剧本难度' }]}
          >
            <Select placeholder="请选择剧本难度">
              {gb_levelSelectData?.dict_label?.map((item) => {
                return (
                  <Select.Option key={item.label_value} value={item.label_value}>
                    {item.label_zh}
                  </Select.Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
            label="玩家人数"
            field="gb_people"
            rules={[{ required: true, message: '请填写玩家说明' }]}
          >
            <InputNumber placeholder="请填写玩家说明..." />
          </FormItem>
          <FormItem
            label="剧本状态"
            field="gb_status"
            rules={[{ required: false, message: '请选择剧本状态' }]}
          >
            <Select placeholder="请选择剧本状态">
              {gb_status_Data?.dict_label?.map((item) => {
                return (
                  <Select.Option key={item.label_value} value={item.label_value}>
                    {item.label_zh}
                  </Select.Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
            label="玩家说明"
            field="gb_people_note"
            rules={[{ required: true, message: '请填写玩家说明' }]}
          >
            <Input placeholder="请填写玩家说明..." />
          </FormItem>
          <FormItem
            label="剧本标签"
            field="gb_text_tag_arr"
            rules={[{ required: true, message: '请选择剧本标签' }]}
          >
            <Select mode="multiple" allowClear placeholder="请选择剧本标签">
              {gb_text_tagSelectData?.dict_label?.map((item) => {
                return (
                  <Select.Option key={item.label_value} value={item.label_value}>
                    {item.label_zh}
                  </Select.Option>
                );
              })}
            </Select>
          </FormItem>
          <FormItem
            label="剧本时长/小时"
            field="gb_hour"
            rules={[{ type: 'number', required: true }]}
          >
            <InputNumber min={1} placeholder="请输入参考价格" />
          </FormItem>
          <FormItem
            label="工作日价格"
            field="gb_price"
            rules={[{ type: 'number', required: true }]}
          >
            <InputNumber min={1} placeholder="请输入工作日价格" />
          </FormItem>
          <FormItem label="周末价格" field="gb_price2" rules={[{ type: 'number', required: true }]}>
            <InputNumber min={1} placeholder="请输入工作日价格" />
          </FormItem>
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
          <FormItem
            label="剧本概要"
            field="gb_text_brief"
            rules={[{ required: true, message: '请填写剧本概要' }]}
          >
            <Input placeholder="请填写剧本概要..." />
          </FormItem>
          <FormItem
            label="剧本描述"
            field="gb_text_content"
            rules={[{ required: false, message: '请填写剧本描述' }]}
          >
            <Input placeholder="请填写剧本描述..." />
          </FormItem>

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
          <FormItem
            label="是否新本"
            field="is_new"
            rules={[{ required: false, message: '请填写版权信息' }]}
          >
            <Select placeholder="是否新本">
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={0}>否</Select.Option>
            </Select>
          </FormItem>
          <FormItem
            label="是否热门"
            field="is_hot"
            rules={[{ required: false, message: '请填写版权信息' }]}
          >
            <Select placeholder="是否热门">
              <Select.Option value={1}>是</Select.Option>
              <Select.Option value={0}>否</Select.Option>
            </Select>
          </FormItem>
          <FormItem
            label="版权信息"
            field="gb_producer"
            rules={[{ required: true, message: '请填写版权信息' }]}
          >
            <Input placeholder="请填写版权信息..." />
          </FormItem>

          <FormItem
            label="备注说明"
            field="gb_remarks"
            rules={[{ required: false, message: '请填写备注说明' }]}
          >
            <Input placeholder="请填写备注说明..." />
          </FormItem>

          <FormItem {...noLabelLayout}>
            <Button
              onClick={async () => {
                if (formRef.current) {
                  console.log(formRef.current.getFields());
                  try {
                    await formRef.current.validate();
                    console.log(formRef.current.getFields());
                    const param = formRef.current.getFields();
                    param.gb_cover =
                      param.gb_cover[0]['url'] || param.gb_cover[0]['response']['data'].file_url;
                    if (modalType === 'edit') {
                      const data = await editDrama(param);
                      if (data.code === 200) {
                        Message.success('修改成功');
                        closeModalAndRequest();
                      }
                      return;
                    } else {
                      const data = await addDrama(param);
                      if (data.code === 200) {
                        Message.success('添加成功');
                        closeModalAndRequest();
                      }
                    }
                  } catch (_) {
                    console.log(_);
                    console.log(
                      'formRef.current.getFieldsError()',
                      formRef.current.getFieldsError()
                    );

                    Message.error('校验失败，请检查字段！');
                  }
                }
              }}
              type="primary"
              style={{ marginRight: 24 }}
            >
              Submit
            </Button>
            <Button
              onClick={() => {
                formRef.current.resetFields();
              }}
            >
              Reset
            </Button>
          </FormItem>
        </Form>
      </div>{' '}
    </Spin>
  );
}

export default DramaForm;
