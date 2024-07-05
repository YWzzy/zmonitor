/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from 'react';
import { Drawer, message } from 'antd';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';
import { unzip } from '@/src/utils/recordScreen';
import styles from './RecordScreen.module.less';

interface RevertBehaviorProps {
  recordScreenDataMsg: {
    open: boolean;
    recordScreenData: string;
  };
  onClose: () => void;
}

export const RecordScreen: React.FC<RevertBehaviorProps> = ({ recordScreenDataMsg, onClose }) => {
  const playerRef = useRef<rrwebPlayer | null>(null);

  useEffect(() => {
    if (recordScreenDataMsg.open && recordScreenDataMsg.recordScreenData.length > 0) {
      const firstRecord = recordScreenDataMsg.recordScreenData;
      if (firstRecord) {
        const events = unzip(firstRecord);
        playerRef.current = new rrwebPlayer({
          target: document.getElementById('player') as HTMLElement,
          props: {
            events,
          },
        });
      } else {
        message.warning('暂无数据，请稍后重试~');
      }
    }

    return () => {
      if (playerRef.current) {
        playerRef.current = null;
        const playerElement = document.getElementById('player');
        if (playerElement) {
          playerElement.innerHTML = ''; // Clear the player content
        }
      }
    };
  }, [recordScreenDataMsg]);

  return (
    <Drawer
      title="操作录屏"
      width={1200}
      placement="right"
      onClose={() => {
        if (playerRef.current) {
          playerRef.current = null;
          const playerElement = document.getElementById('player');
          if (playerElement) {
            playerElement.innerHTML = ''; // Clear the player content
          }
        }
        onClose();
      }}
      open={recordScreenDataMsg.open}
      className={styles.drawer}
    >
      <div id="player" className={styles.player}></div>
    </Drawer>
  );
};
