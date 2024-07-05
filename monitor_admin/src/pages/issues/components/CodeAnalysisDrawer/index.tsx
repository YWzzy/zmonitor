import React from 'react';
import { Drawer, Alert } from 'antd';
import { CodeShow } from '@/src/components';

export const CodeAnalysisDrawer = ({ codeMsg, onClose }) => {
  return (
    <Drawer width={800} title="代码解析结果" onClose={onClose} open={codeMsg.open}>
      <Alert
        message={
          <span>
            源代码位置：{codeMsg.originalPosition.source}
            {`(${codeMsg.originalPosition.line}, ${codeMsg.originalPosition.column})`}
          </span>
        }
        type="info"
      />
      <CodeShow
        start={codeMsg.start}
        hightLine={codeMsg.originalPosition?.line - codeMsg.start + 1}
      >
        {codeMsg.code.join('\n')}
      </CodeShow>
    </Drawer>
  );
};
