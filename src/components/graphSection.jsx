
import ClientsGraphicalData from '../chart/pieChart';
import BarX from '../chart/barGraph';
import { useRef } from 'react';
import { ArrowLeft, ArrowRight, CircleDivideIcon } from 'lucide-react';

let InView=null;
const storeState=true;
/*
const routers=[
    {
        name:'router0',
        holder:'0741882818',
        mac:'XXXXXXXXXXXXXXXXXXXXXXXXX',
        routerIP:"192.168.1.2"
    },
    {
        name:'router1',
        holder:'0780910033',
        mac:'XXXXXXXXXXXXXXXXXXXXXXXXX',
        routerIP:"192.168.1.2"
    }
]

const runningCodes=[
    {
        routerIP:"192.168.1.2",
        payment:"ugx.1000"
    }
]
*/

export const GraphSection=({routers,runningCodes})=>{
    const counter=useRef(0);

  
    
return <section>
    <div className={" py-24 px-4  relative justify-center "} >
    <div className={'graph-area space-y-4  space-x-6 container overflow-x-auto mx-auto max-w-5xl '}>
                            {

                                storeState === true ?? routers.length > 0 ? routers.map((router,key) => {
                                    
                                    let data = [];
                                    counter.current++;
                                    if (counter.current >= routers.length) counter.current = 0;
                                
                                    for (const code of runningCodes) {
                                        if ( code.routerIP!=undefined) {
                                        //    alert(code.routerIP);
                                        if(code.routerIP==router.routerIP)    data.push(code);
                                        }
                                    }  

                                   
                                    //remove this line after tests
                                 //  data = runningCodes;
                                 //   if (counter.current == 1) InView = `charts-${counter.current}`;

                                  // ${(counter.current-1)!=0 && 'hidden'
                                    return (
                                      <div key={key} className={` ${(counter.current-1)!=0 && ''  } overflow-x-auto flex flex-col mx-auto bg-card rounded-[20px] py-4 px-4  space-y-8 `} >
                                        <div  id={`charts-${counter.current}`} className={`grid grid-cols-1 md:grid md:grid-cols-2 gap-12 `}>
                                                <ClientsGraphicalData tokens={data} />
                                                <BarX tokens={data} />
                                       
                                        </div>

                                      
                                        <div className={"flex md:space-x-12 mx-auto text-xl" } >
                                        <span><ArrowLeft size={24} /></span>
                                        <div className={'zoe-button px-2 py-2 rounded-full bg-primary text-primary-foreground font-medium transition-all duration-300 hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]  hover:scale-105 active:scale-95 px-8'}><span>{`${router.name}`}</span></div>
                                        <span><ArrowRight size={24} /></span>
                                        </div>
                                    </div>
                                    )
                               
                  

                                }) : <div className={''}><CircleDivideIcon size={20.0} className="animate-spin "/></div>
                            }
                            </div>
    </div>
</section>

}
