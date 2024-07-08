import React, { useRef } from 'react';
import { ErrorButtons, ErrorSearch } from './components';
import { ErrorSearchHandle } from './components/errorSearch';

const Error: React.FC = () => {
  const errorSearchRef = useRef<ErrorSearchHandle>(null);

  const getTableData = () => {
    if (errorSearchRef.current) {
      errorSearchRef.current.toSearch();
    }
  };

  return (
    <>
      <ErrorButtons getTableData={getTableData} />
      <ErrorSearch ref={errorSearchRef} />
    </>
  );
};

export default Error;
