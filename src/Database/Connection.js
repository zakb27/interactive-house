export const getDevices = async()=>{
    const response = await fetch('localhost:3000/getAllDevices', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return await response.json();
}