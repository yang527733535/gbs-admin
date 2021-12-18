import { Alert } from '@arco-design/web-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { ReducerState } from '../../redux';
import styles from './style/index.module.less';

export default function Welcome() {
  const userInfo = useSelector((state: ReducerState) => state.global.userInfo) || {};
  console.log('userInfo: ', userInfo);
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Alert
          type="success"
          content="欢迎使用 梦墨Admin v1.0.0!"
          // content={locale['welcome.invite']}
        />
      </div>
    </div>
  );
}
