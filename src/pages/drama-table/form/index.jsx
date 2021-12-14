import React, { useRef, useEffect, useState } from 'react';
import {
  Form,
  AutoComplete,
  Input,
  Select,
  TreeSelect,
  Button,
  Checkbox,
  Switch,
  Radio,
  Cascader,
  Message,
  InputNumber,
  Rate,
  Slider,
  Upload,
  DatePicker,
  Modal,
} from '@arco-design/web-react';
import { addDrama } from '../../../api/drama.js';

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

function Demo() {
  const formRef = useRef();
  const [size, setSize] = useState('default');

  useEffect(() => {
    // formRef.current.setFieldsValue({ rate: 5 });
  }, []);

  const onValuesChange = (changeValue, values) => {
    console.log('onValuesChange: ', changeValue, values);
  };

  return (
    <div style={{ maxWidth: 650 }}>
      <Form
        ref={formRef}
        {...formItemLayout}
        size={size}
        // initialValues={{
        //   slider: 20,
        //   'a.b[0].c': ['b'],
        // }}
        onSubmit={(e) => {
          console.log(e);
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
        <FormItem
          label="剧本类型"
          field="gb_type"
          rules={[{ required: false, message: '请填写剧本类型' }]}
        >
          <Input placeholder="请填写剧本类型..." />
        </FormItem>
        <FormItem
          label="剧本区域"
          field="gb_area"
          rules={[{ required: false, message: '请填写剧本区域' }]}
        >
          <Input placeholder="请填写剧本区域..." />
        </FormItem>

        <Form.Item
          label="剧本封面"
          field="upload"
          triggerPropName="fileList"
          // initialValue={[
          //   {
          //     uid: '-1',
          //     url:
          //       '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
          //     name: '20200717',
          //   },
          // ]}
        >
          <Upload
            listType="picture-card"
            multiple
            name="files"
            // action="http://120.24.188.169:8000/system/upload/image"
            customRequest={(option) => {
              console.log(option);
              const { onProgress, onError, onSuccess, file } = option;
              console.log('file: ', file);
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
                onSuccess(xhr.responseText, xhr);
              };

              const formData = new FormData();
              formData.append('up_file', file);
              formData.append('module', 'drama');
              xhr.open('post', 'http://120.24.188.169:8000/system/upload/image', true);
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
        <FormItem label="玩家人数" field="gb_people" rules={[{ type: 'number', required: false }]}>
          <InputNumber min={1} placeholder="请输入玩家人数" />
        </FormItem>
        <FormItem label="参考价格" field="gb_price" rules={[{ type: 'number', required: false }]}>
          <InputNumber min={1} placeholder="请输入参考价格" />
        </FormItem>
        <FormItem
          label="玩家说明"
          field="gb_people_note"
          rules={[{ required: false, message: '请填写玩家说明' }]}
        >
          <Input placeholder="请填写玩家说明..." />
        </FormItem>
        {/* <FormItem label="Auto-complete" field="autocomplete" rules={[{ required: true }]}>
          <AutoComplete placeholder="please enter" data={['123', '234', '345', '456']} />
        </FormItem> */}
        {/* <FormItem label="Post" field="post" rules={[{ required: true }]}>
          <Select
            placeholder="please select"
            options={[
              { label: 'one', value: 0 },
              { label: 'two', value: 1 },
              { label: 'three', value: 2 },
            ]}
            allowClear
          />
        </FormItem> */}
        {/* <FormItem
          label="Multiple Choice"
          required
          field="a.b[0].c"
          rules={[
            {
              type: 'array',
              minLength: 1,
              message: 'choice is required',
            },
          ]}
        >
          <Select
            mode="multiple"
            allowCreate
            placeholder="please select"
            options={['a', 'b', 'c', 'd', 'e']}
          />
        </FormItem> */}
        {/* <FormItem
          label="TreeSelect"
          field="treenode"
          rules={[
            {
              required: true,
              message: 'treenode is required',
            },
          ]}
        >
          <TreeSelect allowClear placeholder="please select">
            <TreeSelect.Node key="node1" title="Trunk(node1)">
              <TreeSelect.Node key="node2" title="Leaf(node2)" />
            </TreeSelect.Node>
            <TreeSelect.Node key="node3" title="Trunk2(node3)">
              <TreeSelect.Node key="node4" title="Leaf(node4)" />
              <TreeSelect.Node key="node5" title="Leaf(node5)" />
            </TreeSelect.Node>
          </TreeSelect>
        </FormItem> */}
        <FormItem
          label="推荐星级"
          field="gb_star_lev"
          rules={[
            {
              required: false,
              type: 'number',
            },
          ]}
        >
          <Rate allowHalf />
        </FormItem>

        <FormItem
          label="上架时间"
          field="gb_add_time"
          rules={[
            {
              required: true,
              message: 'gb_add_time is required',
            },
          ]}
        >
          <DatePicker showTime />
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
          rules={[{ required: true, message: '请填写备注说明' }]}
        >
          <Input placeholder="请填写备注说明..." />
        </FormItem>

        {/* <FormItem
          label="Switch"
          field="switch"
          triggerPropName="checked"
          rules={[
            {
              type: 'boolean',
              true: true,
              message: 'must be true',
            },
          ]}
        >
          <Switch />
        </FormItem> */}
        {/* <FormItem
          label="Radio"
          field="radio"
          rules={[
            {
              validator: (value, callback) => {
                if (value !== 'b') {
                  callback('you can only choose b');
                }
              },
            },
          ]}
        >
          <Radio.Group>
            <Radio value="a">A</Radio>
            <Radio value="b">B</Radio>
            <Radio disabled value="c">
              C
            </Radio>
            <Radio value="d"> D </Radio>
          </Radio.Group>
        </FormItem> */}
        {/* <FormItem
          label="Slide"
          field="slider"
          rules={[
            {
              validator: (value, callback) => {
                if (value < 50) {
                  callback('must be greater than 50!');
                }
              },
            },
          ]}
        >
          <Slider></Slider>
        </FormItem> */}

        {/* <FormItem
          {...noLabelLayout}
          field="readme"
          triggerPropName="checked"
          rules={[
            {
              type: 'boolean',
              true: true,
              message: 'must be true',
            },
          ]}
        >
          <Checkbox>I have read the employee manual</Checkbox>
        </FormItem> */}
        <FormItem {...noLabelLayout}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  await formRef.current.validate();
                  console.log(formRef.current);
                  // Message.info('校验通过，提交成功！');
                  console.log(formRef.current.getFields());
                  const data = await addDrama(formRef.current.getFields());
                  console.log('param: ', data);
                } catch (_) {
                  console.log(formRef.current.getFieldsError());

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

export default Demo;
