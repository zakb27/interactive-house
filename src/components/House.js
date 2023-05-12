import * as THREE from 'three';
import React, {useEffect, useState} from "react";
import '../styles/house.css'
import {getDevices} from '../Database/Connection'
import Devices from './Devices'
const House = () => {

    // useEffect(() => {
    //    getDevices.then((res)=>{
    //        console.log(res)
    //    })
    // }, []);


    return (
        <div className={'container'}>
        <div className="banner">
        </div>
        <div className={'devices_container'}>
            <Devices />
        </div>
        </div>
    )

}

export default House;