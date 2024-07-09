const COLOR = ['#1f8800', '#49de78', '#f9aa35', '#c33300'];

const PerformanceRange = {
  whiteTime: [1000, 2000, 3000],
  FCP: [1000, 2000, 3000],
  LCP: [1000, 2500, 4000],
  FID: [100, 300, 500],
  TTFB: [100, 300, 500],
  dnsTime: [500, 2000],
  tcpTime: [500, 2000],
  requestTime: [1000, 2000, 3000],
};

export const getStatusColor = (score: number, key: PerformanceInKey) => {
  const range = PerformanceRange[key] || [];
  let index = 0;
  while (index < range.length) {
    if (score < range[index]) {
      return COLOR[index];
    }
    index++;
  }
  return COLOR[index];
};
