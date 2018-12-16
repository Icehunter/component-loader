import * as React from 'react';

import { ComponentLoader } from 'lib';

const App: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ComponentLoader
        fetchUrl="http://localhost:3000/dist/1.0.0/index.json"
        componentName="Button"
        globals={{
          React
        }}
      />
      <ComponentLoader
        fetchUrl="http://localhost:3000/dist/2.0.0/index.json"
        componentName="Button"
        globals={{
          React
        }}
      />
      <ComponentLoader
        fetchUrl="http://localhost:3000/dist/3.0.0/index.json"
        componentName="Button"
        globals={{
          React
        }}
      />
      <ComponentLoader
        fetchUrl="http://localhost:3000/dist/4.0.0/index.json"
        componentName="Button"
        globals={{
          React
        }}
      />
      <ComponentLoader
        fetchUrl="http://localhost:3000/dist/5.0.0/index.json"
        componentName="Button"
        globals={{
          React
        }}
      />
      <ComponentLoader
        fetchUrl="http://localhost:3000/dist/index.json"
        componentName="Button"
        globals={{
          React
        }}
      />
      <ComponentLoader
        fetchUrl="http://localhost:3000/badurl.json"
        componentName="Button"
        globals={{
          React
        }}
      />
      <ComponentLoader
        fetchUrl="http://localhost:3000/dist/index.json"
        componentName="BadComponentName"
        globals={{
          React
        }}
      />
    </div>
  );
};

export default App;
