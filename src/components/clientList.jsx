import { ClientFooter } from "./clientFooter";
import { useState } from "react";
import { networkObject } from "../pages/network";
import { CircleNotch } from "phosphor-react";
import SERVER_IP from "../serverIP";

export const ClientsList=({headerList,list})=>{
    const [priceX, SetPrice] = useState('1000/=');
    const [loading,setLoading]=useState(false);
    const [initiate,setInitiating]=useState(false);
    const [verified,setVerified]=useState(false);

    const SetCurrentPrice = (Event) => {
        SetPrice(Event.target.value);
        return true;
    }

    const HandleLogin =async (id) => {
        let clientMAC='62:da:79:fa:34:2e';
        console.log('polling radius server...');

        let params=new URLSearchParams();
            params.append('clientMac',clientMAC);
            params.append('username','testuser');
            params.append('password','testpw');
     //    alert(params.get('clientMac'));


        const input = document.getElementById(id).value;
        if (input === '' || input === undefined || (/[+#$%@!*-]/.test(input))) {
            alert('Invalid input,no special characters are allowed');
            return false;
        }

        
        if (await networkObject.isNetworkError()) {
            alert('Network Error');
            setLoading(false);
            return;
        }

        setLoading(true);

        //this 'ip' field is just for testing purposes 
        //this id is used to remember this client if it disconnects and reconnects again
        const ghostUser = localStorage.getItem('ghost-user');

        let result =  networkObject.sendLogin({voucher:input,ghostUser:ghostUser,ip:'192.168.43.122'});
        result.then(async(resp) => {
             result=resp.data;

             if(result==undefined) {
                alert('Login  unsucccessful....Please check your token');
                setVerified('Not verified');
                setLoading(false);
                return false;
            }
            else if (result.status === 200) {
                setVerified('verified');
                localStorage.setItem('ghost-user',result.clientID);

                await fetch(`/api/portal/auth`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: params,
                    })
                    .then((result)=>result.json())
                    .then((result) => {
                        if (result.status !== 200) {
                            console.log('Request Failure...'+result.message) // throw new Error('Failed to post Request...');
                            return false;
                        }
        
                        setLoading(false);
                        console.log('Post request succefully submitted');
                        //change this to another website of your choice
                        return window.location.href=`http://192.168.1.3:5173/connect-success`;
                            })
                            
                            .catch(err=>{
                                console.error(err);
                                return false;
                            });

            }
         
        })
   
    }

    const HandlePhoneNumber = async (id) => {
        const phoneNumber = document.getElementById(id).value;

        if ((/[a-zA-Z]/.test(phoneNumber) ||
            (/[*&^%$#@!]/.test(phoneNumber)) ||
            phoneNumber.length !== 10
        )) {
            alert('Invalid Phone Number Input');
            return false;
        }


        if (await networkObject.isNetworkError()) {
            alert('Network Error');
            setLoading(false);
            return;
        }

        setLoading(true);

        //this 'ip' field is just for testing purposes
        //this id is used to remember this client if it disconnects and reconnects again
        const ghostUser = localStorage.getItem('ghost-user');

        const result = networkObject.sendPhoneNumber({ phoneNumber:phoneNumber,selectedPrice:priceX, ghostUser: ghostUser, ip: '192.168.43.122' });
        result.then((result) => {
            if (result.status === 200) {
                setLoading(false);
                setVerified('You are now online');
                alert('Payment initiation successfull');
             
            }
            else {
                alert('Login  unsucccessful....');
                setVerified('Not verified');
                setLoading(false);
            }
        })

    }

    return <div className={'bg-card py-12 px-5 relative mx-8  my-8 max-h-screen items-center justify-center space-y-8'} >
   
   <div className={" mx-auto max-w-4xl grid grid-cols-2 lg:flex lg:space-x-24 "} >
     {
      headerList.map((navItem,key)=>(
          <span key={key} className={"text-foreground font-bold text-xl "} >
              {navItem}
          </span>
      ))
    }
     </div>
   
   <div className={"mx-auto max-w-4xl  md:flex  space-x-3"} >
    <div className={"  rounded-[12px] mb-4 lg:ml-0 max-w-4xl overflow-y-hidden overflow-x-hidden whitespace-nowrap max-h-80 space-x-4 mx-auto "} >
    {
        list.map((item,key)=>(
            <div key={key} className={" grid py-4 px-0  grid-cols-2 gap-12 lg:flex lg:space-x-24  bg-graph-area mb-6 justify-center items-center text-primary hover:text-foreground"} >
                <span>{item.name}</span>
                <span>{item.amount}</span>
        </div>
        ))
    }
     </div>

<div className={"flex flex-col mt-[-10%] space-y-4 lg:text-sm"} >
    <div className={" flex flex-col space-y-6 w-full mx-auto text-xl lg:text-[16px] "} >
 <span>Enter Token</span>
 <span><input id="token-id" type="text" placeholder="token" className={"gradient-border max-sm:w-[200px] py-1 "} /></span>
    </div>
    <button onClick={()=>{HandleLogin('token-id')}} className={"zoe-button px-2 py-2 rounded-full bg-primary text-primary-foreground font-medium  transition-all duration-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]  hover:scale-105 active:scale-95 "} >{loading?<CircleNotch className="animate-spin ml-[50%]" size={20.0} />: 'Login'}</button>

    <span>OR</span>

    <div className={"whitespace-nowrap flex flex-col space-y-6 w-full mx-auto text-xl lg:text-[16px] "} >
    <div clas={'timeframe-div '}>
                        <label>Select Package Price:</label>
                        <select id="select-element" onChange={(Event) => {SetCurrentPrice(Event) }} className="timeframe-select border focus:outline-none focus:bg-blue-500 bg-blue-500 rounded">
                            <option id="default-time-option" value={'1000/='}>1000/=</option>
                            <option id="default-time-option" value={'2500/='} >2500/=</option>
                            <option id="default-time-option" value={'5000/='} >5000/=</option>
                            <option id="default-time-option" value={'9000/='} >9000/=</option>
                            <option id="default-time-option" value={'18000/='} >18000/=</option>    </select>
                    </div>
 
 <span>Enter phone Number</span>
 <span><input id="phone-number" type="text" placeholder="074***********" className={"max-sm:w-[200px] gradient-border py-1"} /></span>
    </div>

    <button onClick={()=>{HandlePhoneNumber('phone-number')}} className={"zoe-button px-2 py-2 rounded-full bg-primary text-primary-foreground font-medium  transition-all duration-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)] hover:scale-105 active:scale-95 "} >{initiate?<CircleNotch size={20.0} className="ml-[50%] animate-spin " /> :'Initiate'}</button>
</div>
     </div>

<ClientFooter/>
    </div>    
}