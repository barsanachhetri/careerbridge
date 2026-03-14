import React,{useEffect,useState} from "react";
import API from "../services/api";

function Applications(){

const [apps,setApps] = useState([]);

useEffect(()=>{
fetchApps();
},[]);

const fetchApps = async ()=>{

const res = await API.get("/applications/my");

setApps(res.data);

};

return(

<div className="container mt-5">

<h2>My Applications</h2>

{apps.map(app=>(
<div key={app._id} className="card p-3 mb-2">

<h4>{app.job.companyName}</h4>

<p>Status: {app.status}</p>

</div>
))}

</div>

);

}

export default Applications;