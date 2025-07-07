import { Copy, LoaderIcon } from "lucide-react";
import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { setNewCode } from "../redux/defaultSlice";
import { networkObject } from "../pages/network";

const clientTimeFrames= ['1-HR','6-HRS','12-HRS','24-HRS','48-HRS(2Days)','72-HRS(3Days)','1-week','1-month'];

export const GenerateToken=({code})=>{

const [storeState,setState]=useState(true);
const [isSending,setSending]=useState(false);
let [currentCode,setCode]=useState(code);
let [showCopyIcon,setCopy]= useState(true);
const dispatch=useDispatch();
let expiry=null;

//alert(currentCode);

    const generateNewToken = (Event) => {
        const evTarget = Event.target.value;
        if (evTarget === '----select time frame------') {
            alert('Please select an option');
            return false;
        }

        const value = Event.target.value.split('-')[0];
         expiry = value * 3600; //86,400ms is 24hrs and 3600 is 1 hour]converting hours to seconds
        }


    const NotifyServerAbtNewToken =async () => {
        if (expiry === null) {
            alert('Please re-validate your selection');
            return;
        }

        if (await networkObject.isNetworkError()) {
            alert('Network Error');
            return;
        }

        setSending(true);
        const generatedValue = networkObject.getNewVoucher(expiry);
        generatedValue.then((result) => {
            if (result) {
                dispatch(setNewCode({payload:result.code}));
                setCode(result.code);
                setSending(false);
                expiry = null; //reseting settings
            }
            else {
                alert('Failed to generate code');
                setSending(false);
            }
        });

    }


    return <div className={'bg-card py-12 px-5  relative mx-8 container my-8 max-h-screen items-center justify-center space-y-8'} >
   
 
 <div className={"grid grid-cols-1  gap-4"} >
     <div className={" flex flex-col space-y-6 w-full mx-auto text-xl"} >
  <span className={"font-bold"}  >Select Timeframe</span>
  <select id="select-element" onChange={(Event) => {  generateNewToken(Event) }} className="timeframe-select bg-card text-sm lg:text-1xl gradient-border items-center justify-center mx-auto">
                                <option id="default-time-option" selected>----select time frame------</option>

                                {
                                    storeState===true ?
                                        clientTimeFrames.map((frame,index) => {
                                            return (
                                                <option key={index} id={`time-option-${index}`} className="time-option">{frame}</option>
                                            )
                                        })
                                        :
                                       <option><LoaderIcon color="yellow" className=" animate-spin" size={20.0}/>
                                        </option> 
                                }
    </select>    
   </div>
 
     <button onClick={(Event)=>{NotifyServerAbtNewToken()}} className={"zoe-button px-2 py-2 rounded-full bg-primary text-primary-foreground font-medium  transition-all duration-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]  hover:scale-105 active:scale-95 w-1/2  ml-18 md:ml-40 lg:ml-80 "} > {!isSending ? 'Generate Token':'Generating...'}</button>

<div className={"md:flex space-x-7 justify-center mx-auto items-center"} >
     <span className={"text-1xl font-bold"} >Your Token code is:</span>
    
     <span className={'user-link flex space-x-4 ' }>
                            <span id='token-code' className="current-token text-2xl  font-bold ">{currentCode}</span>
                            {showCopyIcon ?
                            <span className={"mt-2"} > <Copy size={20.5} onClick={async () => {
                                await navigator.clipboard.writeText(document.getElementById('token-code').innerText);
                                setCopy(false);
                            }}
                                className="" /></span>
                                : <span className={"mt-2"} >Copied!</span>  
                        }
                        </span>
                        </div>
 </div> 
</div>  
}