import * as THREE from 'three';
import React, {useEffect, useState} from "react";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from "three/addons/controls/OrbitControls";
import thing from '../assets/apartment.glb'
const House = () => {
    // Renders canvas
    // useEffect(()=>{
    //     function SceneManager(canvas) {
    //         //Calls all functions
    //         const scene = buildScene();
    //         const renderer = buildRenderer(canvas);
    //         const camera = buildCamera();
    //
    //         //Builds scene
    //         function buildScene() {
    //             const scene = new THREE.Scene();
    //             return scene;
    //         }
    //         // Sets up renderer for canvas
    //         function buildRenderer(canvas) {
    //             const renderer = new THREE.WebGLRenderer();
    //             renderer.setClearColor( 0xffffff, 0);
    //
    //             // renderer.setPixelRatio(window.devicePixelRatio/2); //Change this line values for different resolution and performance
    //             renderer.setPixelRatio(1); //Change this line values for different resolution and performance
    //             if (window.innerWidth<600){
    //                 renderer.setSize(window.innerWidth, (window.innerHeight + 200));
    //             }
    //             else{
    //                 renderer.setSize(window.innerWidth, window.innerHeight);
    //             }
    //
    //             // changeHeight(window.innerHeight + 200)
    //             canvas.appendChild(renderer.domElement);
    //             return renderer;
    //         }
    //
    //         // Whole view for canvas
    //         function buildCamera() {
    //             // const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight*2, 1, 20000);
    //             // camera.position.set(-1000, 30, 50);
    //             const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    //             camera.position.set( 30, 30, 100 );
    //             return camera;
    //         }
    //
    //         this.update = async function () {
    //             renderer.render(scene, camera);
    //         }
    //         function onWindowResize() {
    //
    //             if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    //                 //     camera.aspect = window.innerWidth / (window.innerHeight+200);
    //                 //     camera.updateProjectionMatrix();
    //                 //     renderer.setSize( window.innerWidth, (window.innerHeight+200));
    //             }
    //             else{
    //                 camera.aspect = window.innerWidth / window.innerHeight;
    //                 camera.updateProjectionMatrix();
    //                 renderer.setSize( window.innerWidth, window.innerHeight);
    //             }
    //
    //
    //         }
    //         window.addEventListener('resize', onWindowResize);
    //     }
    //
    //     const canvas = document.getElementById("canvas");
    //     const sceneManager = new SceneManager(canvas);
    //
    //     //Animates the water
    //     function animate() {
    //         requestAnimationFrame(animate);
    //         sceneManager.update();
    //     }
    //     animate();
    //
    //     // Updates sun every ten seconds
    //     const interval = setInterval(() => {
    //         function animate() {
    //             sceneManager.updateSun();
    //         }
    //         animate();
    //
    //     }, 10000);
    //     return () => {
    //         clearInterval(interval);
    //     };
    //
    // },[])

    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
// const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        // const material = new THREE.MeshBasicMaterial( { color: 0xE3ff22 } );
        // const cube = new THREE.Mesh( geometry, material );
        // scene.add( cube );

        camera.position.z = 5;
        const controls = new OrbitControls( camera, renderer.domElement );
        camera.position.set( 0, 3, 0 );
        controls.update();

        const loader = new GLTFLoader();
        loader.load(thing, function ( gltf ) {
                scene.add( gltf.scene );
            },
            function ( xhr ) {
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            function ( error ) {
                console.log( 'An error happened' );
            }
        );
        // var al = new THREE.AmbientLight( 0x324891 );
        // al.intensity = 10;
        // scene.add( al );
        const dl = new THREE.DirectionalLight( 0xffffff, 1 );
        dl.position.set( 10, 10, 10 );
        scene.add( dl );
        const ds = new THREE.DirectionalLight( 0xffffff, 1 );
        ds.position.set( -10, 10, 10 );
        scene.add( ds );

        const animate = function () {
            requestAnimationFrame( animate );

            // cube.rotation.x += 0.01;
            // cube.rotation.y += 0.01;
            controls.update();
            renderer.setClearColor( 0xffffff, 0);
            renderer.render( scene, camera );
        };

        animate();
    }, []);


    return (
        <div>
            <div id="canvas"></div>
        </div>
    )

}

export default House;