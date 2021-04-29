import * as React from 'react';
import * as ReactDOM from 'react-dom';

// This is copied from ua-contracts-web, it's the React hook we use to call any
// ua-contracts endpoint. Full docs available at:
// https://github.com/CanonicalLtd/ua-contracts/blob/develop/web/src/Hooks.js#L46
function useContracts(method, url, body, opts) {
    const [state, dispatch] = React.useReducer(setRequestState, {
        error: null,
        data: null,
        status: 0,
        loading: null,
        fetchTs: null,
    });

    let fetchFn = React.useCallback(() => {
        dispatch({type: "MAKE_REQUEST_AGAIN"});
    }, []);

    opts = opts || {};
    let deps = opts.deps || [];
    let onDemand = opts.onDemand || false;
    let adapter = opts.adapter || (rsp => rsp);
    if (body !== undefined) {
        body = JSON.stringify(body);
    }

    React.useEffect(() => {
        let canceled = false;
        // If we should only fetch on demand, and no request was made to fetch,
        // then do nothing.
        if (onDemand && state.fetchTs === null) {
            return;
        }

        let makeRequest = async () => {
            try {
                let rsp = await fetch("/ua-contracts" + url, {
                    headers: {
                        "Content-Type": "application/json",
                        // We use the Accept header because we only expect
                        // JSON, and also because our reverse proxy understands
                        // a request with a header like this to mean we want it
                        // to forward the request to ua-contracts.
                        "Accept": "application/json",
                    },
                    method,
                    body,
                })
                if (canceled) return;

                let data = await rsp.text();
                if (!data) {
                    data = "{}"
                }
                data = JSON.parse(data);
                if (canceled) return;
                dispatch({
                    type: "SET_REQUEST_AS_DONE",
                    payload: adapter({
                        data: data,
                        error: rsp.status !== 200 ? (data || true) : null,
                        status: rsp.status,
                        loading: false,
                    })
                });
            } catch (err) {
                if (canceled) return;
                console.error("Error in request to ua-contracts:", err);
                dispatch({
                    type: "SET_REQUEST_AS_DONE",
                    payload: adapter({
                        data: err.toString(),
                        error: err.toString(),
                        status: 0,
                        loading: false,
                    })
                });
            }
        }
        makeRequest();
        dispatch({type: "SET_REQUEST_IN_PROGRESS"});

        return () => {
            canceled = true;
        }
        // eslint-disable-next-line
    }, [method, url, body, onDemand, state.fetchTs, ...deps]);

    let indicator = null;
    let error = state.error;
    // Kind of silly, but resilient, as we basically want to skip {}, null and
    // undefined, and that is tougher than it looks in JS...
    if (error && error !== "{}" && error !== "null") {
        indicator = <div>{JSON.stringify(error)}</div>;
    } else if (state.loading || (!onDemand && !state.data)) {
        indicator = <div>Loading...</div>;
    }

    return {
        fetch: fetchFn,
        data: state.data,
        error: state.error,
        status: state.status,
        loading: state.loading,
        indicator: indicator,
        lastFetch: state.fetchTs,
    }
}

// Used by useContracts above.
function setRequestState(state, action) {
    if (action.type === "SET_REQUEST_IN_PROGRESS") {
        return {
            data: state.data,
            error: null,
            status: 0,
            loading: true,
            fetchTs: state.fetchTs,
        }
    }
    if (action.type === "SET_REQUEST_AS_DONE") {
        return {
            data: action.payload.data,
            error: action.payload.error ? action.payload.data : null,
            status: action.payload.status,
            loading: action.payload.loading,
            fetchTs: state.fetchTs,
        }
    }
    if (action.type === "MAKE_REQUEST_AGAIN") {
        return {
            data: state.data,
            error: state.error,
            status: state.status,
            loading: state.loading,
            fetchTs: Date.now(),
        }
    }
}

// This is a component to illustrate how to use useContracts to implement a
// simple component (in this case, just shows the list of accounts the user is
// a part of).
function Accounts() {
  let rsp = useContracts("GET", "/v1/accounts");
  if (rsp.indicator) return rsp.indicator;

  let accounts = rsp.data.accounts.map(account => {
    return <li key={account.id}>
      {account.name}
    </li>;
  });

  return <div style={{backgroundColor: "#ccc"}}>
    <h3>Accounts</h3>
    <ul>
      {accounts}
    </ul>
  </div>;
}

ReactDOM.render(<Accounts/>, document.getElementById('root'));
