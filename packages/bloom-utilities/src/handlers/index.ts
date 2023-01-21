import { AxiosError } from 'axios';
import { FirebaseError } from 'firebase/app';
import { BloomError } from '@bloom-trade/types';
/**
 * It takes an error object and returns a BloomError object
 * @param {any | unknown} err - any | unknown
 * @param {any} alert - any
 * @param [callback]
 * @returns An object with the following properties:
 *   isError: boolean
 *   errorObj: any
 *   errorMessage: string
 *   errorCode: string
 *   errorStatus: number
 *   errorData: any
 *   errorHeaders: any
 *   errorConfig: any
 *   errorRequest: any
 *   errorResponse: any
 *   errorMethod: string
 *   errorUrl: string
 */
const errorHandler = <T>(
  err: any | unknown,
  alert: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' | null,
    callback?: any
  ) => void,
  callback?: () => void
): BloomError<T> => {
  let errorInstance: BloomError<T> = {
    isError: true,
    errorObj: err,
  };
  if (err instanceof AxiosError)
    errorInstance = manageAxiosError<T>(err, errorInstance, alert, callback);
  if (err instanceof FirebaseError)
    errorInstance = manageFirebaseError<T>(err, errorInstance, alert, callback);
  if (typeof err === 'string' || err instanceof String)
    alert(err.toString(), 'error');
  return {
    ...errorInstance,
  };
};

const manageAxiosError = <T>(
  err: AxiosError<any>,
  errInstance: BloomError<T>,
  alert: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' | null,
    callback?: any
  ) => void,
  callback?: () => void
) => {
  const { response } = err as AxiosError<T>;

  const { data } = response as any;
  if (data.message) {
    alert(data.message, 'error', callback && callback());
  } else {
    alert('Oops! Something went wrong', 'error', callback && callback());
  }
  Object.assign(errInstance, {
    code: errInstance.code,
    msg: errInstance.msg,
    unknown: false,
  });
  return errInstance;
};

const manageFirebaseError = <T>(
  err: FirebaseError,
  errorInstance: BloomError<T>,
  alert: (
    message: string,
    type: 'success' | 'error' | 'info' | 'warning' | null,
    callback?: any
  ) => void,
  callback?: () => void
) => {
  Object.assign(errorInstance, {
    code: err.code,
    msg: err.message,
    unknown: false,
  });
  alert(err.message, 'error', callback && callback());
  return errorInstance;
};

export { errorHandler };
