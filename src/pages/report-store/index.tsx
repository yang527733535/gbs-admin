import React from 'react';
import { Result } from '@arco-design/web-react';
import styles from './style/index.module.less';

function Exception404() {
  return (
    <div className={styles.container}>
      <Result className={styles.result} status="404" subTitle="网页正在开发中" />
    </div>
  );
}

export default Exception404;
