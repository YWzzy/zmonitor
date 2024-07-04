import React, { useEffect, useState } from 'react';
import { Alert, Button, DatePicker, Drawer, Form, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import dayjs from 'dayjs';
import { Card, CodeShow } from '@/src/components';
import { getIssueErrorList } from '@/src/api';
import { useAppStore } from '@/src/hooks';

export const ErrorSearch = () => {
  const [form] = Form.useForm();

  const [tableData, setTableData] = useState([]);

  const { active } = useAppStore();

  const [loading, setLoading] = useState(false);

  const [codeMsg, setCodeMsg] = useState({
    open: false,
    code: [],
    originalPosition: {
      source: '',
      line: 0,
      column: 0,
      name: '',
    },
    start: 12,
  });

  const toSearch = async () => {
    const { date } = form.getFieldsValue();
    const query = {
      appId: active,
      beginTime: date ? date[0].format('YYYY-MM-DD 00:00:00') : undefined,
      endTime: date ? date[1].format('YYYY-MM-DD 23:59:59') : undefined,
    };
    search(query);
  };

  const toReset = () => {
    form.resetFields();
    search({
      appId: active,
      beginTime: dayjs().format('YYYY-MM-DD 00:00:00'),
      endTime: dayjs().format('YYYY-MM-DD 23:59:59'),
    });
  };

  const search = async (searchQuery: AnalyseReq) => {
    setLoading(true);
    const { data } = await getIssueErrorList(searchQuery);

    console.log('====================================');
    console.log(data);
    console.log('====================================');

    setTableData(data);
    setLoading(false);
  };

  const columns: TableColumnsType<ErrorMsgItem> = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (text, record, index) => index + 1,
    },
    {
      title: '报错信息',
      dataIndex: 'message',
      key: 'message',
      width: 200,
    },
    {
      title: '报错页面',
      dataIndex: 'pageUrl',
      key: 'pageUrl',
      width: 100,
    },
    {
      title: '报错时间',
      dataIndex: 'time',
      key: 'time',
      width: 150,
      render: (text, record) => (
        <span>
          {record.time
            ? dayjs(record.time).format('YYYY-MM-DD HH:mm:ss')
            : dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
    },
    {
      title: '项目编号',
      dataIndex: 'apikey',
      key: 'apikey',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
    },
    {
      title: 'SDK版本',
      dataIndex: 'sdkVersion',
      key: 'sdkVersion',
    },
    {
      title: '浏览器信息',
      dataIndex: 'deviceInfo',
      key: 'browserInfo',
      render: (text, record) => <span>{record.deviceInfo.browser}</span>,
    },
    {
      title: '操作系统',
      dataIndex: 'deviceInfo',
      key: 'osInfo',
      render: (text, record) => <span>{record.deviceInfo.os}</span>,
    },
    {
      title: '还原错误代码',
      dataIndex: 'recordScreenId',
      key: 'revertCode',
      width: 100,
      fixed: 'right',
      render: (text, record) =>
        record.type === 'error' || record.type === 'unhandledrejection' ? (
          <Button type="primary" onClick={() => revertCode(record)}>
            查看源码
          </Button>
        ) : null,
    },
    {
      title: '播放录屏',
      dataIndex: 'recordScreenId',
      key: 'playRecord',
      width: 100,
      fixed: 'right',
      render: (text, record) =>
        record.recordScreenId ? (
          <Button type="primary" onClick={() => playRecord(record.recordScreenId)}>
            播放录屏
          </Button>
        ) : null,
    },
    {
      title: '用户行为记录',
      dataIndex: 'breadcrumb',
      key: 'userBehavior',
      width: 125,
      fixed: 'right',
      render: (text, record) =>
        record.breadcrumb ? (
          <Button type="primary" onClick={() => revertBehavior(record)}>
            查看用户行为
          </Button>
        ) : null,
    },
  ];

  const revertCode = record => {
    // 还原错误代码的逻辑
    console.log('还原错误代码', record);
  };

  const playRecord = recordScreenId => {
    // 播放录屏的逻辑
    console.log('播放录屏', recordScreenId);
  };

  const revertBehavior = record => {
    // 查看用户行为的逻辑
    console.log('查看用户行为', record);
  };

  useEffect(() => {
    if (active) {
      toReset();
    }
  }, [active]);

  return (
    <Card title="异常查询">
      <Form form={form} style={{ paddingBottom: 20 }} name="horizontal_login" layout="inline">
        <Form.Item name="date" label="日期" initialValue={[dayjs(), dayjs()]}>
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={toSearch}>
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={toReset}>重置</Button>
        </Form.Item>
      </Form>

      <Table
        sticky
        rowKey={'id'}
        loading={loading}
        columns={columns}
        dataSource={tableData}
        scroll={{ x: 1300 }}
      />
      <Drawer
        width={800}
        title={'代码解析结果'}
        onClose={() => {
          setCodeMsg({
            ...codeMsg,
            open: false,
          });
        }}
        open={codeMsg.open}
      >
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
    </Card>
  );
};
