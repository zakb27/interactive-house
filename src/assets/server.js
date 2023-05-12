const http = require('http');
const express = require('express');
const app = express();
const fs = require("fs");
const cors = require('cors');

// ...

app.use(cors());
// const rooms = JSON.parse(fs.readFileSync('./src/assets/rooms.json', 'utf8'));
// const devices = JSON.parse(fs.readFileSync('./src/assets/devices.json', 'utf8'));
// let schedule = JSON.parse(fs.readFileSync('./src/assets/schedule.json', 'utf8'));
const rooms = JSON.parse(fs.readFileSync('./rooms.json', 'utf8'));
const devices = JSON.parse(fs.readFileSync('./devices.json', 'utf8'));
let schedule = JSON.parse(fs.readFileSync('./schedule.json', 'utf8'));
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

app.use(express.json());
app.get('/', function(req, res) {
    console.log('something happen');
    res.status(200).json({ success: true, message: 'Secret saved successfully' });

});
app.get('/getAllRooms', function(req, res) {
    res.json(rooms);
});

app.post('/updateWash',function(req, res) {
    try{

        const {id, temp, length} = req.body;
        const allDevices = devices;
        allDevices.devices.forEach(device => {
            if (device.id === id && (device.type==='washer' || device.type==='dishwasher')) {
                device.value = temp;
                console.log(device.type)
                device.time = length
            }
        });
        fs.writeFile('./devices.json', JSON.stringify(allDevices), function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({message: 'Error updating washing data file'});
            } else {
                devices.devices = allDevices.devices;
                res.status(200).json({message: 'Washing data updated successfully'});
            }
        });
    }
    catch(e){
        res.status(401).json({message: 'Washing data unsuccessful'});
    }
});

app.post('/getPromptDevices',function(req, res) {
    try{
        const items = req.body;
        if(items==={}){
            res.json([])
        }
        const newJson = []
        const allDevices = devices.devices;
        allDevices.forEach(device => {
            const found = items.find(el => el === device.id);
            if (found) newJson.push(device);
        });
        console.log(newJson)
        res.status(200).json(newJson);
    }
    catch(e){
        res.status(401).json({});
    }
});


app.get('/getHouseTemp', function(req, res) {
    try{
        const allDevices = devices.devices;
        let avg = 0
        let count =0
        allDevices.forEach(device => {
            if(device.type==='temp'){
                count++
                avg = avg+device.value
            }
        });
        const final = avg/count
        res.json(final);
    }
    catch(e){
        res.json(0)
    }

});

app.post('/deleteSchedules',function(req,res) {
    const newSchedule = schedule;
    const ids = req.body.ids;
    const days = req.body.days;

    for(const day of days) {
        if (newSchedule.hasOwnProperty(day)) {
            for (const id of ids) {
                if (newSchedule[day].hasOwnProperty(id)) {
                    delete newSchedule[day][id];
                }
            }
        }
    }

    fs.writeFile('./schedule.json', JSON.stringify(newSchedule), function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating schedule data');
        } else {
            schedule = newSchedule;
            res.send('Schedule updated successfully');
        }
    });
})



app.post('/getSchedules',function(req,res){
    const id = req.body.id;

    const idList = [];
    const result = {};

    // Loop through each day
    for (const [day, schedules] of Object.entries(schedule)) {
        // Loop through each schedule on the day
        for (const [scheduleName, scheduleData] of Object.entries(schedules)) {
            if (scheduleData.id === id) {
                // Add the day to the list of days for this schedule
                if (!result[scheduleData.startTime]) {
                    result[scheduleData.startTime] = {
                        startTime: scheduleData.startTime,
                        endTime: scheduleData.endTime,
                        value: scheduleData.value,
                        days: [],
                        ids:[]
                    };
                }
                result[scheduleData.startTime].days.push(day);
                result[scheduleData.startTime].ids.push(scheduleName);
            }
        }
    }

    const mergedSchedules = {};
    for (const [startTime, scheduleData] of Object.entries(result)) {
        const key = `${scheduleData.startTime}-${scheduleData.endTime}`;
        if (!mergedSchedules[key]) {
            mergedSchedules[key] = {
                startTime: scheduleData.startTime,
                endTime: scheduleData.endTime,
                value: scheduleData.value,
                days: [],
                ids:scheduleData.ids
            };
        }
        mergedSchedules[key].days = [...new Set([...mergedSchedules[key].days, ...scheduleData.days])];
    }

    // Convert the merged schedules object back to an array
    const mergedSchedulesArray = Object.values(mergedSchedules);

    // Filter out schedules that are not attached to the given ID
    const filteredSchedules = mergedSchedulesArray.filter(schedule => schedule.days.length > 0);

    res.json(filteredSchedules);



})

app.post('/createSchedule',function (req, res) {
    const schedules = schedule;
    const { id, days, starter, ender, value } = req.body;
    console.log(req.body)
    const start = starter;
    const end = ender;
    // Loops through schedule days to check if system exists
    for (const day of days) {
        const daySchedule = schedules[day] || {};
        for (const existingSchedule of Object.values(daySchedule)) {
            console.log(existingSchedule.startTime<=starter)
            if (((existingSchedule.startTime <= start && existingSchedule.endTime >= start) ||
                    (existingSchedule.startTime <= end && existingSchedule.endTime >= end))
                && (existingSchedule.id==id)){
                console.log('here')
                return res.status(408).json({message: 'New schedule overlaps'});
            }
        }
    }
    // Generate a unique ID for the new schedule
    for (const day of days) {
        const newId = uuidv4();
        schedules[day][newId] ={
            startTime: start,
            endTime: end,
            value: value,
            originalValue:value,
            id:id
        };
    }

    fs.writeFile('./schedule.json', JSON.stringify(schedules), function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating schedule data');
        } else {
            schedule = schedules;
            res.send('Schedule updated successfully');
        }
    });

});

app.post('/updateDevice',function(req,res){

    const allDevices=devices;
    const id = req.body.id;
    allDevices.devices.forEach(device=>{
        if(device.id===id){
            if(device.hasOwnProperty("color")){
                device.color=req.body.color
            }
            device.value=req.body.value;
        }
    });
    console.log('Accepted');

    fs.writeFile('./devices.json', JSON.stringify(allDevices), function(err) {
        if (err) {
            console.error(err);
            res.status(500).send('Error updating rooms data');
        } else {
            devices.devices = allDevices.devices;
            res.send('Rooms data updated successfully');
        }
    });
});

app.post('/getMinutes',function(req,res){

    const allDevices=devices;
    const id = req.body.id;
    const currentTime = new Date()
    let newTime=0
    let minutes=0
    allDevices.devices.forEach(device=>{
        if(device.id===id && device.value>0){
            newTime = new Date(device.startTime)
            const seconds = Math.abs(currentTime.getTime() - newTime.getTime())/1000;
            minutes = seconds/60
        }
    });

    res.json(minutes)
});

app.post('/getSeconds',function(req,res){

    const allDevices=devices;
    const id = req.body.id;
    const currentTime = new Date()
    let newTime=0
    let seconds=0
    allDevices.devices.forEach(device=>{
        if(device.id===id && device.value>0){
            console.log(device.value);
            console.log(device.id);
            newTime = new Date(device.startTime)
            seconds = Math.abs(currentTime.getTime() - newTime.getTime())/1000;
        }
    });
    res.json(seconds)
});

app.post('/updateDoor',async function (req, res) {
    const allDevices = devices;
    const hold = devices;
    const time = new Date();
    const id = req.body.id;
    const pin = req.body.pin
    console.log(req.body)
    let keyValid
    for (const device of allDevices.devices) {
        if (device.id === id) {
            // Compares hashed pin and returns if false otherwise continues
            keyValid = await bcrypt.compare(pin, device.key);
            if (!keyValid) {
                return res.status(480).send('Incorrect pin');
            }
            console.log('het uidfhg')
            device.value = 1;
            device.startTime = time
        }
    }


    await fs.writeFile('./devices.json', JSON.stringify(allDevices), function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating devices data');
        } else {
            devices.devices = allDevices.devices;
        }
    });

    console.log('Door Opened');

    setTimeout(() => {

        allDevices.devices.forEach(device => {
            if (device.id === id) {
                device.value = 0;
            }
        });
        // Revert the JSON data to the original data
        fs.writeFile('./devices.json', JSON.stringify(allDevices), function (err) {
            if (err) {
                console.error(err);
                return res.status(500).send('Error updating devices data');
            } else {
                devices.devices = allDevices.devices;

            }
        });
        console.log("Door closed")
    }, 10000);
    return res.send('Doing updated successfully');

});


app.get('/getAllDevices', function(req, res) {
    let thing = JSON.parse(fs.readFileSync('./devices.json', 'utf8'));
    res.json(thing);
});




app.get('/getMachine', function(req, res) {
    const allDevices=devices;
    let element=''
    allDevices.devices.forEach(device=>{
        if((device.type==='washer'||device.type==='dishwasher')&&device.time>0){
            element=(device)
        }
    });
    res.json(element)
});

const updateDevice = (existingSchedule) =>{
    const allDevices = devices;
    allDevices.devices.forEach(device=>{
        if(device.id===existingSchedule.id){
            device.originalValue = device.value
            device.value=existingSchedule.value;
        }
    });
    fs.writeFile('./devices.json', JSON.stringify(allDevices), function(err) {
        if (err) {
            console.error(err);
            console.log('Error updating device data');
        } else {
            devices.devices = allDevices.devices;
            console.log('Device updated successfully');
        }
    });
}

const revertDevice = (existingSchedule) =>{
    const allDevices = devices;
    allDevices.devices.forEach(device=>{
        if(device.id===existingSchedule.id){
            device.value = device.originalValue
        }
    });
    fs.writeFile('./devices.json', JSON.stringify(allDevices), function(err) {
        if (err) {
            console.error(err);
            console.log('Error updating device data');
        } else {
            devices.devices = allDevices.devices;
            console.log('Device updated successfully');
        }
    });
}

const runMachines = () =>{
    const allDevices=devices;
    allDevices.devices.forEach(device=>{
        if(device.type==='washer'||device.type==='dishwasher'&&device.time>0){
            device.time=device.time-1;
        }
    });
    fs.writeFile('./devices.json', JSON.stringify(allDevices), function(err) {
        if (err) {
            console.error(err);
        } else {
            devices.devices = allDevices.devices;
        }
    });
}
const scheduleDevice = () =>{
    // Gets date and formats it to look similar to json format
    const date = new Date();
    const day = (new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(date));
    const start = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    // Loops through schedules JSON days to find a corresponding start time to run updateDevice
    const daySchedule = schedule[day];
    for (const current of Object.values(daySchedule)) {
        if(current.startTime==start){
            updateDevice(current)
        }
        else if(current.endTime==start){
            revertDevice(current)
        }
    }
    // Sets up washing/dishwasher checks
    runMachines();
}
setInterval(scheduleDevice,60000);

app.listen(3005);
console.log('App Server is listening on port 3005');
