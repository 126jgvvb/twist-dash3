import { GraphSection } from "../components/graphSection";
import { NavBar } from "../components/NavBar";
import { ThemeToggle } from "../components/ThemeToggle";
import { HeaderSection } from "../components/headerSection";
import { ListHeader } from "../components/listHeader";
import { RouterList } from "../components/routerList";
import { PackagesList } from "../components/packages";
import { AddRouter } from "../components/addRouter";
import { GenerateToken } from "../components/tokenGenerate";
import { Footer } from "../components/footer";

import { useSelector,useDispatch } from "react-redux";
import { getOnlineData } from "../redux/defaultSlice";
import { pingServer } from "../redux/defaultSlice";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { networkObject } from "./network";

/*
const listOfItems=[
    {
        token:"weirvmk",
        number:"0741882818",
        status:"connected",
        payment:"ugx.1000",
        time:"12Hrs"
    },
    {
        token:"weirvmk",
        number:"074KKKKKkkk8",
        status:"discconnected",
        payment:"ugx.7000",
        time:"9Hrs"
    },
    {
        token:"adran",
        number:"074XXXXXXXXXX",
        status:"connected",
        payment:"ugx.300",
        time:"9Hrs"
    },
    {
        token:"weardo",
        number:"07455668",
        status:"connected",
        payment:"ugx.100",
        time:"7Hrs"
    }
];

const listOfHeadings=[
    'Client Token','Phone Number','Status','Payment','Remaining Time'
];

const routerHeading=[
    'Router Name','Mac address','Holder','Status','Connections'
];

const routerList=[
    {
        name:"router 1",
        holder:"0741882818",
        mac:"***********",
        status:"active",
        connections:3
    },
    {
        name:"router 1",
        holder:"0741882818",
        mac:"***********",
        status:"active",
        connections:3
    },
    {
        name:"router 1",
        holder:"0741882818",
        mac:"***********",
        status:"active",
        connections:3
    }, {
        name:"router 1",
        holder:"0741882818",
        mac:"***********",
        status:"active",
        connections:3
    },
];

const packageHeader=['package','Amount'];
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


export const Home=()=>{
    const serverActive=useSelector((state)=>state.reducerX.dynamicData.serverActive);
    const amountList=useSelector((state)=>state.reducerX.dynamicData.amountList);
    const listOfItems=useSelector((state)=>state.reducerX.dynamicData.runningCodes);
    const routerList=useSelector((state)=>state.reducerX.dynamicData.routerList);

    const listOfHeadings=useSelector((state)=>state.reducerX.staticData.listOfHeadings);
    const packageHeader=useSelector((state)=>state.reducerX.staticData.packageHeader);
    const routerHeading=useSelector((state)=>state.reducerX.staticData.routerHeading);
    const adminDetails=useSelector((state)=>state.reducerX.dynamicData.adminDetails);
    const code=useSelector((state)=>state.reducerX.dynamicData.currentCode);

    const navigate=useNavigate();
    const user = localStorage.getItem('verified-user');
    const jwtToken = localStorage.getItem('twist-jwt-token');
    const dispatch=useDispatch();
    
    useEffect(()=>{
        dispatch(pingServer());
        alert(serverActive);
        if(serverActive){ dispatch(getOnlineData());}
    },[dispatch])

    const checkAuthorization = () => {
        //token available,then verify if it is still valid
        if (jwtToken !== undefined && user !== null) {
            if (networkObject.isNetworkError()==true) {
                return alert('Network error');
            }

            //checking if token is valid
            const result = networkObject.sendPostRequest({ token: jwtToken }, '/admin/jwt-login');
            return result.then((result) => {
                if (result) {
                    console.log('token validation succeeded');
                    return;
                }
                else { navigate('/login'); }
            })
        }
        else {  navigate('/login');  }
  }

checkAuthorization();

    return <div className="min-h-screen bg-background text-foreground oveflow-x-hidden" >
{ /*NavBar */ }
    <NavBar admin={adminDetails}/>
{ /*Theme toggle */ }
    <ThemeToggle/>
{ /*******************main content*************** */ }
<main>

{ /*header */ }
<HeaderSection clas={'mt-34'} mainText={'Current data for Today'} subText={'Please note that this data resets and collected on a daily basis.'} />

{ /*graph section */ }
<GraphSection routers={routerList} runningCodes={listOfItems} />

{ /*running vouchers */ }
<HeaderSection mainText={'Available running tokens'} subText={'Please note that these tokens are deleted in memory once their lifetime expires'} />


{ /*List of clients */ }
<ListHeader listOfHeadings={listOfHeadings} listOfItems={listOfItems} />

{ /*List of routers */ }
<HeaderSection mainText={'Routers Status'} subText={'These routers are located in different locations under the the protection of the person identified by the given holder number.'} />
{/* list of routers*/}
<RouterList headerList={routerHeading} list={routerList} />

{ /*packages and package settings */ }
<HeaderSection mainText={'Available Packages'} subText={'Theses are the packages currently visible to the customers.You can add or remove any from this section.'} />
<PackagesList headerList={packageHeader} list={amountList} />

{ /*add router */ }
<HeaderSection mainText={'Add a New Router'} subText={'For any new router to be monitored on the platform'} />
<AddRouter/>

{ /* token generation */  }
<HeaderSection mainText={'Generate another Token'} subText={''} />
<GenerateToken code={code} />
</main>

{ /*footer */ }
<Footer adminDetails={adminDetails} />

    </div>
}