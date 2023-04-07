import * as THREE from 'three';
import React, {useEffect, useState} from "react";
import '../styles/house.css'
import {getDevices} from '../Database/Connection'
const House = () => {

    // useEffect(() => {
    //    getDevices.then((res)=>{
    //        console.log(res)
    //    })
    // }, []);


    return (
        <>
        <div className="banner">
        </div>
        <div className={'devices_container'}>

            <div className="connected">
                <h2>Name</h2>
                <h3>Type</h3>
                <h4>Value</h4>
                <div className="status"></div>
            </div>

                        <div className="connected">
                <h2>Name</h2>
                <h3>Type</h3>
                <h4>Value</h4>
                <div className="status"></div>
            </div>

                        <div className="connected">
                <h2>Name</h2>
                <h3>Type</h3>
                <h4>Value</h4>
                <div className="status"></div>
            </div>

                        <div className="connected">
                <h2>Name</h2>
                <h3>Type</h3>
                <h4>Value</h4>
                <div className="status"></div>
            </div>

                        <div className="connected">
                <h2>Name</h2>
                <h3>Type</h3>
                <h4>Value</h4>
                <div className="status"></div>
            </div>


            <button>Add device</button>
        </div>
        </>
    )

}

export default House;