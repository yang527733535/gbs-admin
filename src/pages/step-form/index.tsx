import React, { useEffect, useState, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Breadcrumb,
  Spin,
  Steps,
  Card,
  Space,
  Input,
  Button,
  Message,
} from '@arco-design/web-react';
import axios from 'axios';

import BaseInfo from './base-info';
import Service from './service';
import Success from './success';
import { ReducerState } from '../../redux';
import { UPDATE_FORM, UPDATE_LOADING } from './redux/actionTypes';
import useLocale from '../../utils/useLocale';
import styles from './style/index.module.less';

function StepForm() {
  const locale = useLocale();
  const state = useSelector((state: ReducerState) => state.stepForm);
  const dispatch = useDispatch();
  const myinput = createRef();
  const { loading, step } = state;
  const fetchData = () => {
    axios
      .get('/api/stepForm')
      .then((res) => {
        dispatch({ type: UPDATE_FORM, payload: { data: res.data || {} } });
      })
      .finally(() => {
        dispatch({ type: UPDATE_LOADING, payload: { loading: false } });
      });
  };

  useEffect(() => {
    fetchData();
  }, []);
  const [ds, setds] = useState(null);
  let [time, settime] = useState(5);
  const [phoneNum, setphoneNum] = useState(null);

  useEffect(() => {
    document.addEventListener('', function() {});
  }, []);
  var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/;

  const myfn = () => {
    //在这里启动一个计时器
    const id = setInterval(() => {
      console.log(time);
      if (time === 0) {
        clearInterval(ds);
      } else {
        let id = settime((time) => time - 1);
        setds(id);
      }
    }, 1000);
    setds(id);
  };

  return (
    <div className={styles.container}>
      <Card>
        <Space>
          {time}
          <Input
            onChange={(e) => {
              setphoneNum(e);
            }}
            placeholder="请输入手机号码"
          ></Input>
          <Button
            disabled={time != 5}
            onClick={() => {
              console.log(myinput.current);
              // console.log(myinput.focus());
              if (!myreg.test(phoneNum)) {
                // message('请填写正确的手机号码');
                Message.error('请填写正确的手机号码');
                return;
              }
              myfn();
            }}
          >
            {time === 5 ? '获取验证码' : time}
          </Button>
        </Space>
      </Card>
      <Breadcrumb style={{ marginBottom: 5 }}>
        <Breadcrumb.Item>{locale['menu.form.step']}</Breadcrumb.Item>
      </Breadcrumb>
      <Spin loading={loading} style={{ width: '100%' }}>
        <div className={styles.wrapper}>
          <Steps labelPlacement="vertical" className={styles.steps} current={step}>
            <Steps.Step
              title={locale['stepForm.step.title.baseInfo']}
              description={locale['stepForm.step.subTitle.baseInfo']}
            />
            <Steps.Step
              title={locale['stepForm.step.title.target']}
              description={locale['stepForm.step.subTitle.target']}
            />
            <Steps.Step
              title={locale['stepForm.step.title.finish']}
              description={locale['stepForm.step.subTitle.finish']}
            />
          </Steps>
          {step === 1 && <BaseInfo />}
          {step === 2 && <Service />}
          {step === 3 && <Success />}
        </div>
      </Spin>
    </div>
  );
}

export default StepForm;
