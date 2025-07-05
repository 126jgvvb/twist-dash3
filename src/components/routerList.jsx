

export const RouterList=({headerList,list})=>{

    const sumUp=(str)=>{
     let val=Array.from(str).reduce((a,b)=>Number(a)+Number(b),0);
    return val;
    }

    return <div className={'bg-card ml-20 py-12 px-5 overflow-x-auto  relative mx-5 my-8 max-h-screen items-center justify-center space-y-8'} >
   
   <div className={" mx-auto max-w-4xl whitespace-nowrap container flex space-x-3 md:grid md:grid-cols-5 "} >
     {
      headerList.map((navItem,key)=>(
          <a key={key} className={"text-foreground font-bold text-xl "} >
              {navItem}
          </a>
      ))
    }
     </div>
   
    <div className={"  rounded-[12px] max-sm:w-[620px] overflow-x-hidden  max-w-4xl overflow-y-hidden max-h-80 space-x-4 mx-auto "} >
    {
        list.map((item,key)=>(
            <div key={key} className={"grid grid-cols-5 md:gap-5 bg-graph-area mb-6 w-full justify-center items-center text-primary hover:text-foreground"} >
                <span>{item.name}</span>
                <span>{item.routerIP}</span>
                <span>{item.holderNumber}</span>
                <span>{item.status?'Active':'Off'}</span>
                <span>{sumUp(item.connections)}</span>
            </div>
        ))
    }
     </div>
    </div>  
    
    
    
}