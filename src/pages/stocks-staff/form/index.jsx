import React from 'react';
import { Form, Input, Button, Checkbox } from '@arco-design/web-react';
import { registerApi } from '../../../api/user';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
function Index(props) {
  console.log('props: ', props);
  const [form] = Form.useForm();
  return (
    <div>
      <Form
        onSubmit={(v) => {
          console.log(v);
          Message.success('success');
        }}
        form={form}
      >
        <FormItem label="用户名">
          <Input  placeholder="请输入你的用户名称..." />
        </FormItem>
        <FormItem label="密码">
          <Input placeholder="请输入你的密码..." />
        </FormItem>
        {/* <FormItem wrapperCol={{ offset: 5 }}>
          <Checkbox>I have read the manual</Checkbox>
        </FormItem> */}
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

Index.propTypes = {
  name: PropTypes.string.isRequired,
};
export default Index;
