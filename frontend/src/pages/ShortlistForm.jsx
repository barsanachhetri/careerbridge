import {useState} from "react";
import API from "../services/api";

function ShortlistForm({applicationId}){

const [roundName,setRoundName] = useState("");
const [roundDate,setRoundDate] = useState("");
const [roundTime,setRoundTime] = useState("");
const [instructions,setInstructions] = useState("");

const shortlist = async ()=>{

await API.put("/applications/"+applicationId,{
status:"Shortlisted",
roundName,
roundDate,
roundTime,
instructions
});

alert("Student shortlisted");

};

return(

<div>

<h3>Next Round Details</h3>

<input
placeholder="Round Name"
onChange={(e)=>setRoundName(e.target.value)}
/>

<input
type="date"
onChange={(e)=>setRoundDate(e.target.value)}
/>

<input
type="time"
onChange={(e)=>setRoundTime(e.target.value)}
/>

<textarea
placeholder="Instructions"
onChange={(e)=>setInstructions(e.target.value)}
></textarea>

<button onClick={shortlist}>
Confirm Shortlist
</button>

</div>

);

}

export default ShortlistForm;