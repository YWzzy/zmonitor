import React, { useEffect, useState } from 'react';
import { Layout, Menu, Modal, Select, Button } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  PlusCircleFilled,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import stylels from './index.module.less';
import { loginOut } from '@/src/api';
import logoPng from '@/src/images/logo.png';
import { checkAppStatus, AddApplication } from '@/src/components';
import { munuRouters, hasAppRouters } from '@/src/router';
import { useAppStore } from '@/src/hooks';
import { ConfigApplication } from '@/src/components/configApplication';
const { Sider } = Layout;

function Home() {
  const [collapsed, setCollapsed] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    setKey(location.pathname);
  }, [location]);

  useEffect(() => {
    setTimeout(() => {
      setCollapsed(true);
    }, 10);
  }, []);

  const { pathname } = useLocation();

  const [openMenuKey, setKey] = useState(pathname);

  const { apps, active, showAddModal, showConfigModal, appDispatch, curConfAppId } = useAppStore();

  const menus = React.useMemo(() => {
    const menus = apps.length < 0 ? munuRouters : [...munuRouters, ...hasAppRouters];
    return menus.map(item => ({
      key: item.path,
      icon: React.createElement(item.icon),
      label: item.name,
    }));
  }, [apps.length]);

  const leftSideWidth = collapsed ? 80 : 200;

  return (
    <div className={stylels.content}>
      <div className={stylels.left} style={{ width: leftSideWidth }}>
        {
          <div className={stylels.logo}>
            <div className={stylels['logo-content']}>
              <img src={logoPng} alt="" />
              <span>前端监控平台</span>
            </div>
          </div>
        }
        <div className={stylels['menu-wrap']}>
          <Sider
            breakpoint="lg"
            style={{ width: leftSideWidth, maxWidth: leftSideWidth }}
            collapsed={collapsed}
            collapsible
            trigger={null}
            onCollapse={value => setCollapsed(value)}
          >
            <Menu
              selectedKeys={[openMenuKey]}
              onClick={val => {
                setKey(val.key);
              }}
              theme="dark"
              style={{ width: leftSideWidth, fontSize: 16 }}
              mode="inline"
              defaultSelectedKeys={['4']}
              onSelect={info => {
                navigate(info.key);
              }}
              items={menus}
            />
          </Sider>
        </div>
      </div>
      <div
        className={stylels.right}
        style={{ width: `calc(100vw - ${leftSideWidth}px)`, marginLeft: leftSideWidth }}
      >
        <div className={stylels['right-wrap']}>
          <div className={stylels.header}>
            <span>
              {collapsed ? (
                <MenuUnfoldOutlined
                  onClick={() => {
                    setCollapsed(!collapsed);
                  }}
                />
              ) : (
                <MenuFoldOutlined
                  onClick={() => {
                    setCollapsed(!collapsed);
                  }}
                />
              )}
              {apps.length > 0 && (
                <Select
                  className={stylels.appSelect}
                  onChange={val => {
                    appDispatch.updateActive(val);
                  }}
                  value={active}
                >
                  {apps.map(item => (
                    <Select.Option key={item.id} value={item.appId}>
                      {item.appName}
                    </Select.Option>
                  ))}
                </Select>
              )}
              <Button
                type="primary"
                onClick={() => {
                  appDispatch.updateAddModalStatus(true);
                }}
                icon={<PlusCircleFilled />}
              >
                创建应用
              </Button>
            </span>
            <PoweroffOutlined
              onClick={() => {
                Modal.confirm({
                  title: '确定退出登录？',
                  okText: '确定',
                  cancelText: '取消',
                  onOk: async () => {
                    await loginOut();
                    dispatch.user.resetUserInfo();
                    dispatch.app.resetAppModel();
                    navigate('/login');
                  },
                });
              }}
              className={stylels.poweroffOutlined}
            />
          </div>
          <div className={stylels['page-wrap']}>
            <div className={stylels['page-content']}>
              <Outlet />
            </div>
          </div>
        </div>
      </div>
      <AddApplication
        open={showAddModal}
        onClose={() => {
          appDispatch.updateAddModalStatus(false);
        }}
      />
      <ConfigApplication
        open={showConfigModal}
        appId={curConfAppId}
        onClose={() => {
          appDispatch.updateConfigModalStatus(false);
        }}
      />
    </div>
  );
}

export default checkAppStatus(Home);
