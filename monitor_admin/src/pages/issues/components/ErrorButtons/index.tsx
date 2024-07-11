/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Button, Row, Card, Form, message } from 'antd';

interface ErrorButtonsProps {
  getTableData: () => void;
}

export const ErrorButtons: React.FC<ErrorButtonsProps> = ({ getTableData }) => {
  const codeErr = () => {
    getTableData();
    const a = undefined;
    if (a?.length) {
      console.log('1');
    } else {
      message.error('JS Error triggered');
    }
  };

  const asyncError = () => {
    getTableData();
    setTimeout(() => {
      try {
        JSON.parse('');
      } catch (e) {
        message.error('Async Error triggered');
      }
    });
  };

  const promiseErr = () => {
    new Promise((_, reject) => {
      getTableData();
      const person: any = {};
      try {
        person.name.age();
      } catch (e) {
        reject(e);
      }
    }).catch(() => {
      message.error('Promise Error triggered');
    });
  };

  const xhrError = () => {
    const ajax = new XMLHttpRequest();
    ajax.open('GET', 'https://abc.com/test/api');
    ajax.setRequestHeader('content-type', 'application/json');
    ajax.onreadystatechange = function () {
      if (ajax.readyState === 4) {
        getTableData();
        if (ajax.status === 200 || ajax.status === 304) {
          console.log('ajax', ajax);
        } else {
          message.error('XHR Error triggered');
        }
      }
    };
    ajax.send();
    ajax.addEventListener('loadend', () => {});
  };

  const fetchError = () => {
    fetch('https://jsonplaceholder.typicode.com/posts/a', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      body: JSON.stringify({ id: 1 }),
    })
      .then(res => {
        if (res.status === 404) {
          getTableData();
          message.error('Fetch Error triggered');
        }
      })
      .catch(() => {
        getTableData();
        message.error('Fetch Error triggered');
      });
  };

  const fetchSuccess = () => {
      fetch('https://jsonplaceholder.typicode.com/', {
        method: 'GET'
      });
  }

  const resourceError = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://abc.com/index.js';
    document.body.appendChild(script);
    script.onerror = () => {
      getTableData();
      message.error('Resource Error triggered');
    };
  };

  return (
    <Card title="错误测试按钮" bordered={false} style={{ width: '100%' }}>
      <Form style={{ paddingBottom: 20 }} name="horizontal_login" layout="inline">
        <Form.Item>
          <Button type="primary" onClick={codeErr}>
            js错误
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={asyncError}>
            异步错误
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={promiseErr}>
            promise错误
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={xhrError}>
            xhr请求报错
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={fetchError}>
            fetch请求报错
          </Button>
        </Form.Item>
                <Form.Item>
          <Button type="primary" onClick={fetchSuccess}>
            fetch请求成功
          </Button>
        </Form.Item>
        <Form.Item>
          <Row>
            <Button type="primary" onClick={resourceError}>
              加载资源报错
            </Button>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
};
