import React, { useEffect } from 'react';
import { reqUpdateDesc } from '../../../api/drama.js';
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
          const data = await reqUpdateDesc(parma);
          if (data.code === 200) {
            Message.success('修改成功');
            closeModalAndReqData();
          }
          console.log('data: ', data);
        }}
        form={form}
      >
        <FormItem field="subscribe_dm" label="预约DM">
          <Input placeholder="预约DM" />
        </FormItem>
        <FormItem field="subscribe_people" label="预约人数">
          <InputNumber placeholder="预约人数" />
        </FormItem>

        <FormItem field="subscribe_start" label="开始时间">
          <DatePicker showTime />
        </FormItem>
        <FormItem field="subscribe_end" label="结束时间">
          <DatePicker showTime />
        </FormItem>
        <FormItem field="subscribe_remarks" label="预约DM">
          <Input.TextArea placeholder="店家备注" />
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
