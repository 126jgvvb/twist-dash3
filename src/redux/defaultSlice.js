import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import serverIP from "../serverIP";

const adminID=localStorage.getItem('verified-user');

const initialState={

    staticData:{
        listOfHeadings:['Client Token','Phone Number','Status','Payment','Remaining Time'],
        packageHeader:['package','Amount'],
        routerHeading:['Router Name','Mac address','Holder','Status','Connections' ]
    },


    dynamicData:{
        serverActive:false,
        currentCode:'1234',
        adminDetails:{
            name:'delos',
            email:"delos@gmail.com",
            id:"errfxssfs",
            contact:"+256741882818"
        },
        runningCodes:[
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
        ],
        amountList:[
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
               }],
        routerList:[
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
            ],
            listOfItems:[
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
            ]
    }
}


const defaultSlice=createSlice({
name:"defaultSlice",
initialState,
reducers:{
    deletePackage:(state,action)=>{
    state.dynamicData.amountList=state.dynamicData.amountList.filter(item=>item.name!=(action.payload.name));
    },
    setNewCode:(state,action)=>{
    state.dynamicData.currentCode=action.payload
    },
    setPhoneNumber:(state,action)=>{
        state.dynamicData.adminDetails.contact=action.payload;
    },
    addRouter:(state,action)=>{
        state.dynamicData.routerList=state.dynamicData.routerList.push(action.payload);
    },
    addPackage:(state,action)=>{
        state.dynamicData.amountList=state.dynamicData.amountList.push(action.payload);
    }
},
extraReducers:(builder)=>{
    builder
    .addCase(getOnlineData.pending,(state,action)=>{
        console.log('Request is in pending state....');
    })

    .addCase(getOnlineData.fulfilled,(state,action)=>{
        if(action.payload==undefined){
            console.error('Failed to download data....server connection failed!!');
            return false;
        }

        console.log("redux data downloaded...assigning data");
        state.dynamicData.contact=action.payload.phoneNumber;  //assigning the obtained data
        state.dynamicData.amountList=action.payload.packagesList;
        state.dynamicData.runningCodes=action.payload.availableRunningCodes;
        state.dynamicData.routerList=action.payload.routers;
        state.dynamicData.adminDetails=action.payload.admin;
        console.log('Done assigning data....');
    });


    builder
    .addCase(pingServer.pending,(state,action)=>{
        console.log('checking server state...');
    })

    .addCase(pingServer.fulfilled,(state,action)=>{
        if(action.payload==undefined){
            console.error('server connection failed!!');
            return false;
        }

        state.dynamicData.serverActive=action.payload; 
        console.log("server state obtained as",state.dynamicData.serverActive);
    });
}
});


/*
export const pingServer=async()=>{
    console.log(`pinging server at: ${serverIP}/ping`);
         
    try{
   return await fetch(`${serverIP}/admin/ping`)
            .then(resp => resp.json())
            .then((resp) => {
                if (resp.status==200) { initialState.serverActive=true; }
                else {
                    console.log('Server failed to respond...');
                    return false;
                }

            })
            .catch((err) => console.error(err));
           }
           catch(e){ console.log(`server error: ${e}`);  }
}
*/
export const pingServer=createAsyncThunk("ping server",async()=>{
    console.log(`pinging server at: ${serverIP}/ping`);
         
    try{
   return await fetch(`${serverIP}/admin/ping`)
            .then(resp => resp.json())
            .then((resp) => {
                if (resp.status==200) { return true; }
                else {
                    console.log('Server failed to respond...');
                    return false;
                }

            })
            .catch((err) => console.error(err));
           }
           catch(e){ console.log(`server error: ${e}`);  }
});


export const getOnlineData=createAsyncThunk("get-redux-state",
    async ()=>{ 
             console.log(`connecting to: ${serverIP}/admin/get-redux-object?adminID=${adminID}`);
         
             try{
            return await fetch(`${serverIP}/admin/get-redux-object?adminID=${adminID}`)
                     .then(resp => resp.json())
                     .then((resp) => {
                        //inspect this line
                         if (resp.data !== undefined) { return resp.data.data; }
                         else {
                             if (resp.message !== undefined || resp.data !== undefined) console.log(resp.message);
                             else console.log('Network error...');
                             return false;
                         }
         
                     })
                     .catch((err) => console.error(err));
                    }
                    catch(e){ console.log(`Download error: ${e}`);  }
                }
                    
                
);

//pingServer();
export const {deletePackage,addRouter,addPackage,setPhoneNumber,setNewCode}=defaultSlice.actions;
export default defaultSlice.reducer;





