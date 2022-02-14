import React, { useEffect } from 'react';
import { reqCancelDesc } from '../../../api/drama.js';
import { Form, Input, Button, DatePicker, InputNumber, Message } from '@arco-design/web-react';

const FormItem = Form.Item;
function Index({ clickitem, closeModalAndReqData }) {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue({
      ...clickitem,
    });
  }, []);
  return (
    <div>
      <Form
        onSubmit={async (v) => {
          const parma = {
            ...clickitem,
            ...v,
          };
          const data = await reqCancelDesc(parma);
          if (data.code === 200) {
            Message.success('修改成功');
            closeModalAndReqData();
          }
        }}
        form={form}
      >
        <FormItem field="subscribe_remarks" label="取消原因">
          <Input.TextArea placeholder="预约DM" />
        </FormItem>

        <FormItem
          wrapperCol={{
            offset: 5,
          }}
        >
          <Button htmlType="submit" type="primary">
            Submit
          </Button>
        </FormItem>
      </Form>
    </div>
  );
}

export default Index;
