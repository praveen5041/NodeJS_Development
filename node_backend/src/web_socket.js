import { WebSocketServer } from 'ws';
import fs from 'fs-extra';
import { dataFolderName } from './constants.js'
import path from "path";


const startWebSocketServer = () => {
  const wss = new WebSocketServer({ port: 3008 });
  wss.on('connection', (ws) => {
    console.log('WebSocket connection established.');

    // Handle incoming messages
    ws.on('message', (message) => {
      const payload = JSON.parse(message.toString());
      processPayload(payload);
    });
  });
};


let lastUrl = null;
let id = 1


//const urlToFileIdMap={}//new code maping between urls and id
const processPayload = (payload) => {
  const { type, url, data } = payload;
  console.log("*".repeat(80));
  console.log( {type, url, payload} );
  console.log("*".repeat(80));

  if (type !== 'rrweb events') {
    return;
  }
  const jsonData = JSON.parse(data);


  let dataFilePath
  if (url === lastUrl) { // Simply append to the same file;  No change
    dataFilePath = path.join(dataFolderName, id.toString());
    fs.writeJsonSync(dataFilePath, jsonData, { flag: 'a' });
  } 
  else {
      id++;
    dataFilePath = path.join(dataFolderName, id.toString());
    fs.writeJSONSync(dataFilePath,jsonData,{flag:'a'})
      // id++;
  }
  lastUrl = url;


  // let fileId = urlToFileIdMap[url];
  // if (!fileId) {
  //   fileId = Object.keys(urlToFileIdMap).length + 1; // Generate a new file ID
  //   urlToFileIdMap[url] = fileId;
  // }

  // const dataFilePath = path.join(dataFolderName, fileId.toString());
  // fs.writeJsonSync(dataFilePath, {type,url,jsonData});


//storing entire data into single file only like array of objects
  // if(!urlToFileIdMap[url]){
  //   urlToFileIdMap[url]=[]
  // }
  // urlToFileIdMap[url].push({jsonData,payload})
  // const dataFilePath=path.join(dataFolderName,`${encodeURIComponent(url)}.json`)
  // fs.writeJSONSync(dataFilePath,urlToFileIdMap[url])

}




export {
  startWebSocketServer,
};
