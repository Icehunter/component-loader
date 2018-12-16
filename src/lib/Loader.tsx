import * as React from 'react';

import { GridLoader } from 'react-spinners';

export interface LoaderProps {
  loader?: React.ReactNode;
}

export const Loader: React.FC<LoaderProps> = (props) => {
  const { loader } = props;
  if (loader === false) {
    return null;
  }
  if (typeof loader === 'string') {
    return <div>{loader}</div>;
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <GridLoader />
    </div>
  );
};
