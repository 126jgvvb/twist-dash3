import { SERVER_IP } from "../serverIP";
import EncryptData from "../encryption";

let val=false;

export const networkObject={
    networkState:val,
    isNetworkError:()=>{ return networkObject.pingServer(); },

    pingServer:async()=>{
        console.log(`pinging server at: ${SERVER_IP}/admin/ping`);
             
        try{
       return await fetch(`${SERVER_IP}/admin/ping`)
                .then(resp => resp.json())
                .then((resp) => {
                    if (resp.status==200) {return false; }
                    else {
                        console.log('Server failed to respond...');
                        return true;
                    }
    
                })
                .catch((err) => console.error(err));
               }
               catch(e){ console.log(`server error: ${e}`);  }
    },

    getNewVoucher :async (expiry) => {
        const obj = {expiryTime:expiry };

        return await fetch(`${SERVER_IP}/session/generate-voucher`,
            {method: 'POST',
            body: JSON.stringify(obj),
            headers: { 'Content-Type': 'application/json' }
            })

            .then((res)=>res.json())
            .then((result) => {
                if (result.code!==undefined) return result;
                else {
                    console.log('Failed to generate code');
                    return false;
                }
            })
            .catch(err => {
                console.error(err);
                return false;
                // throw new Error('Error occured:' + err);
                 })
    },


    sendPostRequest: async (data, route) => {
        data = EncryptData(data);

        return await fetch(`${SERVER_IP}${route} `,
            {
                body: JSON.stringify({ data: data }),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })
            .then((result)=>result.json())
            .then((result) => {
                if (result.status !== 200) {
                    console.log('Request Failure...'+result.message) // throw new Error('Failed to post Request...');
                    return false;
                }

                    console.log('Post request succefully submitted');
                    return {data:result}
                    })
                    
                    .catch(err=>{
                        console.error(err);
                        return false;
                    });

    },
    

    sendLogin:async (objX) => { 
        try {
            const resp = await fetch(`${SERVER_IP}/client/authenticate-client?voucherCode=${objX.voucher}&ghostUser=${objX.ghostUser}&ip=${objX.ip}`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
            const resp_1 = await resp.json();
            return resp_1;
        } 
        catch (err) {
            console.log(err);
            return false;
        }
    },


    sendPhoneNumber: async (objX) => {  
        try {
            const resp = await fetch(`${SERVER_IP}/client/authenticate-client?phoneNumber=${objX.phoneNumber}&selectedPrice=${objX.selectedPrice}&ghostUser=${objX.ghostUser}&ip=${objX.ip}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });
            const resp_1 = await resp.json();
            return resp_1;
        } catch (err) {
            console.log(err);
            return false;
        }
    },





}