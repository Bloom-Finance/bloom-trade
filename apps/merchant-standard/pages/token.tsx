import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

const Token: NextPage = () => {
  const [isValidToken, setIsValidToken] = useState(false);
  const { query } = useRouter();
  const { authToken } = query;
  useEffect(() => {}, [authToken]);
  return <div>Validating Received Token</div>;
};

export default Token;
