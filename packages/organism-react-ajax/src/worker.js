require('es6-promise/auto');
import get from 'get-object-value';

var ws;
var post;
const callbacks = [];
let isWsConnect;
let wsUrl;
const keys = Object.keys;

try {
    post = postMessage;
    post({ type: "ready" });
} catch (e) {
    post = (data) =>
    {
        const e = {
            data: data
        };
        callbacks.forEach((c)=>{
            c(e); 
        });
    };
}
export default {
    postMessage: (data) =>
    {
        const e = {
            data: data
        };
        onmessage(e);      
    },
    addEventListener: (type, callback) =>
    {
        callbacks.push(callback);        
    }
};

onmessage = (e) =>
{
    const data = get(e, ['data']);
    switch (data.type) 
    {
        case 'initWs':
            initWs(data.ws);
            break;
        case 'ajaxGet':
            ajaxGet(data);
            break;
        case 'ajaxPost':
            ajaxPost(data);
            break;
    }
};

const ajaxGet = ({url, action}) =>
{
    const params = get(action, ['params'], {});
    import('superagent').then((req)=>{
       const headers = {
            ...get(params, ['globalHeaders'], {}),
            ...get(params, ['headers'], {}),
            Accept: get(params, ['accept'], 'application/json')
       };
       req.get(url)
          .query(params.query)
          .set(headers)
          .end((err,res)=>{
            if (res) {
                const {error, req, text, xhr, ...resetRes} = res;
                post({
                    ...action,
                    text: text,
                    response: resetRes 
                });
            }
          });
    });
}

const ajaxPost = ({url, action}) =>
{
     const params = get(action, ['params'], {});
     import('superagent').then((req)=>{
        const queryKeys = keys(params.query);
        const headers = {
            ...get(params, ['globalHeaders'], {}),
            ...get(params, ['headers'], {}),
            Accept: get(params, ['accept'], 'application/json')
        };
        let isSend = false;
        if (params.isSendJson) {
            isSend = true;
        } else {
            queryKeys.every((key)=>{
                 if ('object' !== typeof params.query[key]) {
                    return true;
                 }
                 isSend = true;
                 return false;
            });
        }
        let callReq;
        switch (params.method) {
            case 'put':
                callReq = req.put(url);
                break;
            default:
                callReq = req.post(url);
                break;
        }
        if (isSend) {
           callReq = callReq.send(params.query); 
        } else {
           callReq = callReq.field(params.query); 
        }
        callReq
           .set(headers)
           .end((err,res)=>{
             if (res) {
                 const {error, req, text, xhr, ...resetRes} = res;
                 post({
                     ...action,
                     text: text,
                     response: resetRes 
                 });                 
             }
           });
     });
}

const initWs = (url) =>
{
    wsUrl = url;
    ws = new WebSocket(url);
    ws.onopen = (e) => { };
    ws.onerror = (e) => { };
    ws.onmessage = (e) => {
        isWsConnect = true;
        switch (e.data) {
            case 'pong': 
                break;
            default :
                post({type: 'ws', text: e.data});
                break;
        }
    };
    ws.onclose = (e) => {
        isWsConnect = false;
    };
    wsPing();
};

const wsPing = () =>
{
    setTimeout(()=>{
        if (!isWsConnect) {
            initWs(wsUrl);
        } else {
            ws.send(JSON.stringify({type:'ping'})); 
            wsPing();
        }
    },15000);
}


