import React from 'react';
import { BarChart,Bar,Label,XAxis,YAxis,Cell,CartesianGrid,Tooltip,Legend,ResponsiveContainer } from 'recharts';


//just sample
const dataX = [
    { name: "1 day", value: 15 },
    { name: "3 days", value: 14 },
    { name: "1 week", value: 7 },
    { name: "2 weeks", value: 3 },
    { name: "1 month", value: 9 }
]

const COLORS = ['#6366f1', '#22c55e', '#facc15', '#f97316', '#f45218'];


const BarX = ({ tokens }) => {

    //use this and domain[0,100] when ready
    const data = [
        { name: "1 day", value: 0 },
        { name: "3 days", value: 0 },
        { name: "1 week", value: 0 },
        { name: "2 weeks", value: 0 },
        { name: "1 month", value: 0 }
    ]

    for (let obj of tokens) {
   //     alert(Object.keys(obj));
        // eslint-disable-next-line default-case
        switch (obj.payment) {
            case 'ugx.1000': data[0].value += 1; break
            case 'ugx.2500': data[1].value += 1; break
            case 'ugx.5000': data[2].value += 1; break
            case 'ugx.9000': data[3].value += 1; break
            case 'ugx.18000': data[4].value += 1; break
            case 'any':data[0].value+=1; break //default for voucher clients
        }
    }


    return (
               <ResponsiveContainer className={'min-w-screen/20 graph-height bg-graph-area  min-h-screen/20'}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray={'3 3'} />
                    <XAxis style={{ fill: 'white' }}  dataKey={'name'}><Label value='period' offset={-20} position='insideBottom'/></XAxis>
                    <YAxis style={{fill:'white'}}  domain={['auto','auto']} type='number' dataKey={'value'}><Label value='clients' angle={-90} position="insideLeft"/></YAxis>
                <Tooltip formatter={(value)=>`${value} clients`} labelFormatter={(label)=>`${label} clients`}/>
                <Legend />
                <Bar
                    dataKey={'value'}
                    fill='#22c55e'
                    radius={[6, 6, 0, 0]}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationBegin={300}
                    >
                        {
                            dataX.map((entry, index) => {
                                return (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                )
                            })
                        }
                    </Bar>
                </BarChart>
                </ResponsiveContainer>
    )
}


export default BarX;