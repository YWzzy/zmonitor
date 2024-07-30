import { useLocation } from 'react-router-dom';

export const useQueryParams = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const params: { [key: string]: string } = {};

  queryParams.forEach((value, key) => {
    params[key] = value;
  });

  return { queryParams: params, state: location.state };
};
