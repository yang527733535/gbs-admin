import React from 'react';
import { Form, Input, Button, Checkbox } from '@arco-design/web-react';
import { registerApi } from '../../../api/user';
const FormItem = Form.Item;

export default function Index() {
  const [form] = Form.useForm();

  return (
    <div>
      <Form
        onSubmit={(v) => {
          console.log(v);
          Message.success('success');
        }}
        form={form}
        style={{ width: 600 }}
      >
        <FormItem label="Username">
          <Input placeholder="please enter your username..." />
        </FormItem>
        <FormItem label="Post">
          <Input placeholder="please enter your post..." />
        </FormItem>
        <FormItem wrapperCol={{ offset: 5 }}>
          <Checkbox>I have read the manual</Checkbox>
        </FormItem>
        <FormItem
          wrapperCol={{
            offset: 5,
          }}
        >
          <Button type="primary">Submit</Button>
        </FormItem>
      </Form>
    </div>
  );
}
