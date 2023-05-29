import React, {useEffect,useState} from "react";
import door from '../assets/door.svg'
import light from '../assets/light.svg'
import dishwasher from '../assets/dishwasher.svg'
import other from '../assets/other.svg'
import speaker from '../assets/speaker.svg'
import temp from '../assets/temp.svg'
import washer from '../assets/washer.svg'
import key from '../Database/key'
const Devices = () =>{
    const [devices,changeDevices] = useState([{name:'test',type:'test',value:'test'}])
    useEffect(()=>{
        const getDevices = async()=>{
            const response = await fetch(key+'/getAllDevices');
            const data = await response.json();
            console.log(data.devices)
            changeDevices(data.devices);
            // return json;

            const interval = setInterval(async() => {

                    const response = await fetch(key+'/getAllDevices');
                    const data = await response.json();
                    console.log(data.devices)
                    changeDevices(data.devices);
                    // return json;


            }, 5000);
        }
        getDevices()

    },[])

    return(
        <>
        {devices.map((item,index)=>{
            let bing = <></>
            let thing = item.type
            let classColour = 'red'
                let ifOn=''
                switch(item.type){
                    case('door'):
                        bing= <img className={'item_logo'} src={door} alt="Door image" />
                        thing="Door Control"

                        if(item.value>0){
                            ifOn='Open'
                            classColour='blue'
                        }
                        else{
                            ifOn='Locked'
                        }
                        break
                    case('dishwasher'):
                        thing="Dishwasher"
                        bing= <img className={'item_logo'} src={dishwasher} alt="Door image" />
                        if(item.time>0){
                            ifOn=item.time.toString()+ ' mins left at '+ item.value.toString() +'°C'
                            classColour = 'blue'
                        }
                        else{
                            ifOn='Off'
                        }
                        break
                    case('light'):
                        thing="Light"
                        bing= <img className={'item_logo'} src={light} alt="Door image" />
                        if(item.value>0){
                            ifOn='On'
                            classColour='green'
                        }
                        else{
                            ifOn='Off'
                        }
                        break
                    case('speaker'):
                        thing="Speaker"
                        bing= <img className={'item_logo'} src={speaker} alt="Door image" />
                        if(item.value>0){
                            ifOn='On'
                            classColour='green'

                        }
                        else{
                            ifOn='Off'
                        }
                        break
                    case('temp'):
                        thing="Set Temperature"
                        bing= <img className={'item_logo'} src={temp} alt="Door image" />
                        ifOn=item.value.toString() + '\u00B0C'
                        classColour='blue'

                        break
                    case('washer'):
                        thing='Washing machine'
                        bing= <img className={'item_logo'} src={washer} alt="Door image" />
                        if(item.time>0){
                            ifOn=item.time.toString()+ ' mins left at '+ item.value.toString() +'°C'
                            classColour='blue'
                        }
                        else{
                            ifOn='Off'
                        }
                        break
                    case('other'):
                        thing='Other'
                        bing= <img className={'item_logo'} src={other} alt="Door image" />
                        if(item.value>0){
                            ifOn='On'
                            classColour='green'
                        }
                        else{
                            ifOn='Off'
                        }
                        break
                    default:
                        bing= <img className={'item_logo'} src={other} alt="Door image" />
                        if(item.value>0){
                            ifOn='On'
                            classColour='green'
                        }
                        else{
                            ifOn='Off'
                        }
                        break
                }
            return(
                <div className="connected" key={index}>
                    <h2 className={`name`}>{item.name}</h2>
                    <h3>{thing}</h3>
                    <h4>{ifOn}</h4>
                    {bing}
                    <div className={`status ${classColour}`}>
                    </div>
                </div>
            )}
            )
        }
        </>

    )

}
export default Devices;