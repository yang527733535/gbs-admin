import React from 'react';
import BaseDetail from './baseDetail/index';
export default function GameDetail({ clickItem }) {
  return (
    <>
      <div>
        <BaseDetail clickItem={clickItem}></BaseDetail>
      </div>
    </>
  );
}
