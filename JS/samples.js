import { getAllSamples, requestDownload } from "./api.js";

const container = document.getElementById("samplesList");

async function loadSamples(){

  container.innerHTML = "Loading samples...";

  try{

    const res = await getAllSamples();

    if(!res.success){
      container.innerHTML = "No samples found";
      return;
    }

    const samples = res.data;

    container.innerHTML = "";

    samples.forEach(sample=>{

      const div = document.createElement("div");

      div.className = "sample-card";

      div.innerHTML = `
      <h3>${sample.originalName}</h3>
      <p>Rows: ${sample.rowCount}</p>
      <p>Columns: ${sample.colCount}</p>

      <button onclick="downloadSample('${sample.id}','${sample.originalName}')">
      Request Download
      </button>
      `;

      container.appendChild(div);

    });

  }catch(err){

    console.error(err);
    container.innerHTML = "Error loading samples";

  }

}

window.downloadSample = async function(id,name){

const email = prompt("Enter your email");

if(!email) return;

const res = await requestDownload({
sampleId:id,
sampleName:name,
email
});

if(res.success){
alert("Download link sent to email");
}else{
alert("Failed to request download");
}

}

loadSamples();