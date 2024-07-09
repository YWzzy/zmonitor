import React, { } from 'react';
import { JsErrorDayLine } from './components';
import { ErrorSearch } from '../issues/components';
const JsError = () => (
  <>
    <JsErrorDayLine />
    {/* <JsErrorSearch/> */}
    <ErrorSearch />
  </>
);

export default JsError;
