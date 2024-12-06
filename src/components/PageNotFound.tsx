import React from 'react';

export const PageNotFound: React.FC = (): JSX.Element => {
  const handleGoBack = () => {
    history.back();
  };

  return (
    <>
      <h1>Page Not Found</h1>
      <button onClick={handleGoBack}>Go Back</button>
    </>
  );
};
