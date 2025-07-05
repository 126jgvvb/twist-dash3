import { useState,useEffect } from "react";
import { ClientsList } from "../components/clientList";
import { HeaderSection } from "../components/headerSection";
import { ThemeToggle } from "../components/ThemeToggle";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { pingServer } from "../redux/defaultSlice";
import { getOnlineData } from "../redux/defaultSlice";

    const packageHeader=['package','Amount'];

    /*
    const amountList=[
    {
     name:'1 Day',
     amount:'ugx.1000'
    },
    {
        name:'2 Days',
        amount:'ugx.2500'
       },
       {
        name:'3 Days',
        amount:'ugx.5000'
       },
       {
        name:'7 Days',
        amount:'ugx.9000'
       },
       {
        name:'1 month',
        amount:'ugx.18000'
       }];
*/





export const Client=()=>{    
    const serverActive=useSelector((state)=>state.serverActive);
    const dispatch=useDispatch();
    
    useEffect(()=>{
        dispatch(pingServer());
        if(serverActive){ dispatch(getOnlineData());}
    },[dispatch]);


    const amountList=useSelector(state=>state.reducerX.dynamicData.amountList);


        return <section className={" mx-2 justify-center mt-[10%] items-center space-y-3"} >
        <ThemeToggle/>
     
        <div className={"mx-auto  text-2xl container bg-card text-center "} >
        <h1 className={"font-bold p-4 text-1xl md:text-2xl "} >
                    <span className={"animate-fade-in "} >
                    Welcome to TWIST HUB
                    </span>
                </h1>
        </div>
    
        <div className={"container bg-card p-3 mx-auto text-center justify-center space-y-3"} >
        <h1 className={"font-bold p-4 text-1xl md:text-2xl "} >
                    <span className={"animate-fade-in "} >
                    This is a list of packages available.Please choose according to your needs
                    </span>
                </h1>

        <ClientsList headerList={packageHeader} list={amountList} />
        </div>
    </section>
    }