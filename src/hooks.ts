import { useRef, useState, useCallback, useEffect } from "react";
import { Http, Store } from "utiliti-js";
import type { Http as TypeHttp } from "utiliti-js"

type Config = {
  delay?: number,
  attempt?: number
}

type Init = {
  method: string,
  url: string,
  data: string | object | undefined,
  signal: undefined | AbortSignal
}

type Interceptor = (request: Init, next: (request: Init) => Promise<Response>) => (Promise<any> | object)

export function useHttp(config?: Config): TypeHttp {
  const httpRef = useRef(new Http(config));
  const http: TypeHttp = httpRef.current
  
  return http;
}

function reactReducer<T, A>(reducer: (state: T, action: A) => T, setState: Function) {
  
  return (state: T, action: A) => {
    const newState: T = reducer(state, action);
    setState(newState);
    
    return newState;
  };
}

export function useStore<T, A>(state: T, reducer: (state: T, action: A) => T) {
  const [_state, _setState] = useState(state);
  const _reducer = useCallback(reducer, []);
 // const _reducer = useCallback(reactReducer(reducer, _setState), []);
  const storeRef = useRef(new Store(_reducer, state))
  
  useEffect(() => {
    return storeRef.current.subscribe(state => _setState(state))
  }, [])
  
  return storeRef.current
}

export function useDispatch<T, A>(store: Store<T, A>): (action: A) => void  {
  return store.dispatch
}

export function useInterceptor(http: Http, interceptor: Interceptor) {
  useRef(http.addInterceptor(interceptor));
}