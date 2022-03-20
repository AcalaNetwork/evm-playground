import { ErrorProps } from 'next/error';

function Error({ statusCode }: ErrorProps) {
  return <p>{statusCode ? `An error ${statusCode} occurred on server` : 'An error occurred on client'}</p>;
}

export default Error;
