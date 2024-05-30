import React, { useEffect, useState } from 'react'
import { getCarModels, getLocationData, getMembershipData, postFormDataApi } from '../api/api'
import { useLocation, useNavigate } from 'react-router-dom'
import { log, time } from 'console'
import { stat } from 'fs'

export const FormComponent = () => {

    const userData = {
        first_name : "",
        last_name : "",
        email_id : "",
        gender : "",
        date_of_birth : "",
        contact:"",
        status:"",
        membership:"",
        location:"",
        car_model:"",
        transmission_type : "",
        fuel_type:"",
        
    }

    let navigate = useNavigate()
    let {state} = useLocation()
    const[formData,setFormData] = useState<any>(userData)
    const[membershipData,setMembershipData] = useState<[]>([])
    const[carModelsData,setcarModelsData] = useState<[]>([])
    const[locationData,setlocationData] = useState<[]>([])
  

    const[formDataValidationMsg,setFormDataValidationMsg]=useState({
        first_name : "",
        last_name : "",
        email_id : "",
        gender : "",
        date_of_birth : "",
        contact:"",
        status:"",
        membership:"",
        location:"",
        car_model:"",
        transmission_type : "",
        fuel_type:"",
        
    })

    useEffect(()=>{
        getInitialPageData()
    },[])
    const getInitialPageData = async () => {
        if(state !=null){
            console.log(state);
            setFormData(state)
            fetchLocationData(state.membership)
            bindLocationData()
            
        }
        try{
            const membershipApiResponse = await getMembershipData()
            console.log(membershipApiResponse.data,"api resp");
            
            
            if(membershipApiResponse.status == 200){
                setMembershipData(membershipApiResponse.data.row1)
            }   

            const carmodelsApiResponse = await getCarModels()
            if(carmodelsApiResponse.status == 200){
            setcarModelsData(carmodelsApiResponse.data.row2)
            } 

        }
        catch(error){
            console.log("Error :",error)
        }
        
    }
    console.log(membershipData,"memberships");
    console.log(carModelsData,"car models");
    
    const bindMembershipData = () =>membershipData.map((ele:any) =><option key={ele.id} value={ele.membership_name} > {ele.membership_name} </option>) 

    const bindCarModels = () => carModelsData.map((ele:any) =><option value={ele.id} > {ele.car_model} </option>) 


    const fetchLocationData = async(id:any)=>{
        console.log(id,"REq");
        try{
            const locationApiResponse = await getLocationData(id)
            console.log(locationApiResponse,"Response");
            

            if(locationApiResponse.status == 200){
                setlocationData(locationApiResponse.data)

            } 
        }
        catch(error){
            console.log("Error :" , error);
        }
        
    }
    const bindLocationData = () => {
        return locationData.map((ele:any) => <option value={ele.location_id}> {ele.location} </option>)
    }

    const onChangeFormData = (event:any) => {
        let id = event.target.id
        setFormData({
            ...formData,[id]:event.target.value
        })
        if(id == "membership" || id == "location" || id=="car_model"){
            setFormData({
                ...formData,[id]:(event.target.value)
            })
        }
        if(event.target.checked){
            setFormData({...formData, [id] : event.target.value})
        }     
        
    }  
    console.log(formData);
    
    const formValidation = () => {
        let cloneValidation = {...formDataValidationMsg}
        let valid = true
        cloneValidation = {
            first_name : "",
            last_name : "",
            email_id : "",
            gender : "",
            date_of_birth : "",
            contact:"",
            status:"",
            membership:"",
            location:"",
            car_model:"",
            transmission_type : "",
            fuel_type:"",
        }
        if(formData.first_name == ""){
            cloneValidation.first_name = "Enter valid First Name";
            valid =  false
        }
                    
        if(formData.last_name ===""){
            cloneValidation.last_name = "Enter valid last Name";
            valid = false
        }
            
        if(formData.email_id == ""){
            cloneValidation.email_id = "Enter valid email id";
            valid = false
            
        }
        if(formData.gender == ""){
           cloneValidation.gender = "Enter valid gender";
           valid = false
           
        } 
        if(formData.date_of_birth == ""){
            cloneValidation.date_of_birth = "Enter valid date"
            valid = false
            
        } 
        if(formData.contact == "" || formData.contact.length>10){
            
            cloneValidation.contact = "Enter valid phone number"
            valid = false
            
        } 
        if(formData.membership == ""){
            cloneValidation.membership = "Enter valid membership"
            valid = false
            
        } 
        if(formData.status == ""){
            cloneValidation.status = "Enter valid status"
            valid = false
            
        } 
        if(formData.location == "") {
           cloneValidation.location = "Enter valid location"
           valid = false
            
        }
        if(formData.car_model == "") {
            cloneValidation.car_model = "Enter valid car type"
            valid = false
            
        }
        if(formData.transmission_type == "") {
            cloneValidation.transmission_type = "Enter valid transmission"
            valid = false
            
        }
        if(formData.fuel_type == "") {
            cloneValidation.fuel_type = "Enter valid fuel type"
            valid = false
            
        }
        setFormDataValidationMsg(cloneValidation)
        return valid
        
    }

    const submitData = async() => {
        console.log(formData,"req");
        if(formValidation()){
            console.log(formDataValidationMsg,"validation array")
            const apiResponse = await postFormDataApi(formData)
            console.log(apiResponse,"response");
            if(apiResponse.status == 200){
                alert("Submitted Successfully")
            }
        }
    }


    return (
    <div>
        <link rel="stylesheet" href="./public/css/form.css" />
        <h2> Add new Customer </h2>
        <h3> Basic Information </h3>

        <div>
            <div className="row">
                <div className="ele">
                <label htmlFor="First_name" className='labels'> First Name </label>
                <input type="text" id='first_name' value={formData["first_name"]}  onChange={(event)=>{onChangeFormData(event)}}/>
                <span className="err">{formDataValidationMsg["first_name"]}</span>
                </div>

                
                <div className="ele">
                <label htmlFor="Last_name" className='labels' > Last Name </label>
                <input type="text" id='last_name' value={formData["last_name"]} onChange={(event)=>{onChangeFormData(event)}} />
                <span className="err">{formDataValidationMsg["last_name"]}</span>
                </div>
                
                <div className="ele">
                <label htmlFor="email" className='labels' > Email Address </label>
                <input type="text" id='email_id' value={formData["email_id"]} onChange={(event)=>{onChangeFormData(event)}} />
                <span className="err">{formDataValidationMsg.email_id}</span>
                </div>
                
            </div>

            <div className="row">

                <div className="ele">
                <label className='labels'> Gender </label>
                <input type="radio" name="Gender" id="gender" value="Male" checked={ (formData.gender == "Male") ? true : false } onChange={(event)=>{onChangeFormData(event)}} /> <label> Male </label>
                <input type="radio" name="Gender" id="gender" value="Female" checked={(formData.gender == "Female") ? true : false } onChange={(event)=>{onChangeFormData(event)}}  /> <label>  Female </label>
                <span className="err">`{formDataValidationMsg.gender}</span>
                </div>
                <div className="ele">
                <label htmlFor="dob" className='labels'>Date of Birth </label>
                <input type="date" name="DOB" id="date_of_birth" value={[formData["date_of_birth"].split("T")[0]]} onChange={(event)=>{onChangeFormData(event)}} /> 
                <span className="err">{formDataValidationMsg.date_of_birth}</span>
                </div>
                <div className="ele">
                <label htmlFor="contact" className='labels'> Contact</label>
                <input type="text" id='contact' value={formData["contact"]} onChange={(event)=>{onChangeFormData(event)}} />
                <span className="err">{formDataValidationMsg.contact}</span>
                </div>
            </div>

            <div className="row">
                <div className="ele">
                <label className='labels' htmlFor='status'> Status </label>
                <input type="radio" name="status" id="status" value="active" checked={ (formData.status == "active") ? true : false} onChange={(event)=>{onChangeFormData(event)
                    console.log(event.target.value,event.target.id)
                }}   /> <label htmlFor="active"> Active </label>
                <input type="radio" name="status" id="status" value="inactive"onChange={(event)=>{onChangeFormData(event)}}/> <label htmlFor="inactive"> Inactive </label>
                <span className="err">{formDataValidationMsg.status}</span>
                </div>

                <div className="ele">
                <label htmlFor="membership" className='labels'>Membership </label>
                <select id='membership' value={formData.membership}  onChange={(event)=>{onChangeFormData(event);fetchLocationData(event.target.value)}}> 
                    <option selected>Select</option>
                     {bindMembershipData()}
                </select>
                <span className="err">{formDataValidationMsg.membership}</span>
                </div>
                <div className="ele">
                <label htmlFor="location" className='labels'onChange={(event)=>{onChangeFormData(event)}}>Location </label>
                <select value={formData.location}  id='location'  onChange={(event)=>{onChangeFormData(event)}}> 
                    <option selected >Select</option>
                    {bindLocationData()}
                </select>
                <span className="err">{formDataValidationMsg.location}</span>
                </div>
            </div >

            <div className="cardetails">
                
                <h3>Car Details</h3>
                <div className="ele">
                <label htmlFor="carmodels" className='labels'>Car Models </label>
                <select value={formData.car_model} id='car_model' onChange={(event)=>{onChangeFormData(event)}}  > 
                    <option selected >Select</option>
                    {bindCarModels()}
                </select>
                <span className="err">{formDataValidationMsg.car_model}</span>
                </div>
                <div className="ele">
                <label htmlFor="transmission" className='labels'>Transmission Type </label>
                <input type="radio" name="transmission" id="transmission_type" value="manual" checked={(formData.transmission_type == "manual") || (formData.transmission_type == "Manual") ? true : false } onChange={(event)=>{onChangeFormData(event)}} /> <label htmlFor="Manual"> Manual </label>
                <input type="radio" name="transmission" id="transmission_type" value="automatic" checked={(formData.transmission_type == "automatic") || (formData.transmission_type == "Automatic") ? true : false } onChange={(event)=>{onChangeFormData(event)}} /> <label htmlFor="Manual"> Automatic </label>
                <span className="err">{formDataValidationMsg.transmission_type}</span>
                </div>

                <div className="ele">
                <label htmlFor="fuel_type" className='labels'> Fuel Type </label>
                <input type="radio" name="fuel_type" id="fuel_type" value="Petrol" checked={(formData.fuel_type == "petrol") || (formData.fuel_type == "Petrol") ? true : false } onChange={(event)=>{onChangeFormData(event)}} /> <label htmlFor="Petrol"> Petrol </label>
                <input type="radio" name="fuel_type" id="fuel_type" value="Diesel" checked={(formData.fuel_type == "diesel") || (formData.fuel_type == "Diesel") ? true : false } onChange={(event)=>{onChangeFormData(event)}} /> <label htmlFor="Diesel"> Diesel </label>
                <span className="err">{formDataValidationMsg.fuel_type}</span>
                </div>
            </div>
        </div>
        
        <div className="btncontainer">
            <button className="submit" onClick={()=>submitData()}> Submit </button>
            {/* // Invoke the navigate variable in onClick attribute of Cancel button. */}
            {/* // Pass the grid component path to the navigate variable.    */}
            <button className="cancel" onClick={()=>navigate('/grid')} > Cancel </button>
                
        </div>
    </div>
    )
    
}
