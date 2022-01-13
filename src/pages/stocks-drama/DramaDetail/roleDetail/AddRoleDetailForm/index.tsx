import { useRef, useEffect, useState } from 'react';

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

const FormItem = Form.Item;

const cascaderOptions = [
  {
    value: 'beijing',
    label: 'Beijing',
    children: [
      {
        value: 'beijingshi',
        label: 'Beijing',
        children: [
          {
            value: 'chaoyang',
            label: 'Chaoyang',
            children: [
              {
                value: 'datunli',
                label: 'Datunli',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    value: 'shanghai',
    label: 'Shanghai',
    children: [
      {
        value: 'shanghaishi',
        label: 'Shanghai',
        children: [
          {
            value: 'huangpu',
            label: 'Huangpu',
          },
        ],
      },
    ],
  },
];

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
    formRef.current.setFieldsValue({ rate: 5 });
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
        initialValues={{
          slider: 20,
          'a.b[0].c': ['b'],
        }}
        onValuesChange={onValuesChange}
        scrollToFirstError
      >
        <FormItem label="Form size">
          <Radio.Group type="button" value={size} onChange={setSize}>
            <Radio value="mini">mini</Radio>
            <Radio value="small">small</Radio>
            <Radio value="default">default</Radio>
            <Radio value="large">large</Radio>
          </Radio.Group>
        </FormItem>
        <FormItem
          label="Username"
          field="name"
          rules={[{ required: true, message: 'username is required' }]}
        >
          <Input placeholder="please enter..." />
        </FormItem>
        <FormItem label="Age" field="age" rules={[{ type: 'number', required: true }]}>
          <InputNumber placeholder="please enter" />
        </FormItem>
        <FormItem
          label="Province"
          field="province"
          rules={[
            {
              type: 'array',
              required: true,
            },
            {
              type: 'array',
              length: 4,
              message: '必须选择长度为四的节点',
            },
          ]}
        >
          <Cascader showSearch placeholder="please select" allowClear options={cascaderOptions} />
        </FormItem>
        <FormItem label="Auto-complete" field="autocomplete" rules={[{ required: true }]}>
          <AutoComplete placeholder="please enter" data={['123', '234', '345', '456']} />
        </FormItem>
        <FormItem label="Post" field="post" rules={[{ required: true }]}>
          <Select
            placeholder="please select"
            options={[
              { label: 'one', value: 0 },
              { label: 'two', value: 1 },
              { label: 'three', value: 2 },
            ]}
            allowClear
          />
        </FormItem>
        <FormItem
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
        </FormItem>
        <FormItem
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
        </FormItem>
        <FormItem
          label="Score"
          field="score"
          rules={[
            {
              required: true,
              type: 'number',
            },
          ]}
        >
          <Rate />
        </FormItem>
        <FormItem
          label="Date"
          field="date"
          rules={[
            {
              required: true,
              message: 'date is required',
            },
          ]}
        >
          <DatePicker showTime />
        </FormItem>
        <FormItem
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
        </FormItem>
        <FormItem
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
        </FormItem>
        <FormItem
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
        </FormItem>
        <Form.Item
          label="Upload"
          field="upload"
          triggerPropName="fileList"
          initialValue={[
            {
              uid: '-1',
              url:
                '//p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/e278888093bef8910e829486fb45dd69.png~tplv-uwbnlip3yd-webp.webp',
              name: '20200717',
            },
          ]}
        >
          <Upload
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
          />
        </Form.Item>
        <FormItem
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
        </FormItem>
        <FormItem {...noLabelLayout}>
          <Button
            onClick={async () => {
              if (formRef.current) {
                try {
                  await formRef.current.validate();
                  Message.info('校验通过，提交成功！');
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
          <Button
            type="text"
            onClick={() => {
              Message.info(`fields: ${formRef.current.getTouchedFields().join(',')}`);
            }}
          >
            Get touched fields
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}
