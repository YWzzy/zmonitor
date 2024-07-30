import React, { useEffect, memo } from 'react';
import { useEchart } from '@/src/hooks';

interface LineIn {
  data: number[];
}

const LineChart: React.FC<LineIn> = ({ data }) => {
  const { ref, setOption } = useEchart();

  useEffect(() => {
    if (data.length > 0) {
      const option = {
        grid: {
          top: 2,
          left: 0,
          right: 0,
          bottom: -10,
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          show: false,
          boundaryGap: false,
          data: data,
        },
        yAxis: {
          type: 'value',
          show: false, // 隐藏Y轴
          min: 0,
        },
        series: [
          {
            type: 'line',
            smooth: true,
            symbol: 'none',
            areaStyle: {},
            data: data,
          },
        ],
      };
      setOption(option);
    }
  }, [data, setOption]);

  return <div ref={ref} className="w-full h-full" />;
};

const NewUserLine = memo(LineChart, (prev, next) => prev.data !== next.data);

export { NewUserLine, LineChart };
