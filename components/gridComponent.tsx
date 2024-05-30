import React, { useContext, useEffect, useState } from 'react'
import { getInitialGridData, getLocationData, getMembershipData } from '../api/api'
import { useNavigate } from 'react-router-dom'


export const GridComponent = () => {

let navigate = useNavigate()
const[gridData,setGridData] = useState<any[]>([])
const[membershipData,setMembershipData] = useState<[]>([])
const[locationData,setLocationData] = useState<[]>([])
const[hideOrShowFilter,setHideOrShowFilter] = useState<boolean>(true)
const[filterData,setFilterData] = useState<{}>({
    membership: "",
    location: "" ,
    status: null
})
const[search,setsearchData] = useState<string>("")
const[sortData,setSortData] = useState<any>({
    column: "user_id",
    order: "asc"
})
const[loadMoreData,setLoadMoreData] = useState<number>(0)
const[sortorder,setSortOrder] = useState<boolean>(true)

useEffect(()=>{
    loadInitialGridData()

},[hideOrShowFilter,sortorder,loadMoreData])  
  
  const loadInitialGridData = async() => {
    const initialPayload = {
            search: search,
            filterData: filterData,
            sortData: sortData,
            loadMore: loadMoreData,
            // signedInUser: "siva.elangovan@avasoft.com"
    }
    console.log(initialPayload,"request")

    if(hideOrShowFilter){
        initialPayload.filterData = {
            membership: "",
            location: "" ,
            status: null
        }
    }

    const apiResponse = await getInitialGridData(initialPayload)
    console.log(apiResponse.data,"curr_response")
        if(initialPayload.loadMore >0){
            setGridData(gridData.concat(apiResponse.data))
        }
        else{
            setGridData(apiResponse.data)
        }
        // else if (loadMoreData!=0){
        //     setGridData(gridData.concat(apiResponse.data))
        // }
        // if (sortData.column != ""){
        //     setGridData(apiResponse.data)
        // }
        // if (search!= ""){
        //     setGridData(apiResponse.data)
        // }
       
  }
  console.log(gridData,'grid');
  
  const bindGridData = () => {
    return gridData.map((ele:any) => <tr className='row'> <td> {ele.User_id} </td> <td>{ele.First_name}</td> <td> {ele.Last_name}</td> <td> {ele.Email_id}</td> <td>{ele.Membership}</td> <td> {ele.Location}</td> <td> {ele.Status} </td> <td><button onClick={() => navigate('/form',{state:ele})}>Edit</button></td></tr>)
  }

  
  const fetchMembershipDropdown = async() => {
    const membershipApiResponse = await getMembershipData()
        if(membershipApiResponse.status == 200){
            setMembershipData(membershipApiResponse.data)

        }   
    }
    
  const bindMembershipDropdown = () => {
    console.log(membershipData);
    
    return membershipData.map((ele:any) => <option value={ele.membership_name}> {ele.membership_name} </option>) 
  }

  const fetchLocationDropdown = async(event:any) => {
    let id = (event.target.value)
        const locationApiresponse = await getLocationData(id)
        if(locationApiresponse.status == 200){
            setLocationData(locationApiresponse.data)
        } 
  }

  const bindLocationDropdown = () => {
    return locationData.map((ele:any) => <option value={ele.location.id}> {ele.location} </option>)
  }
  
  
  const onClickSort = (event:any) => {
        setSortOrder(!sortorder)
    if(sortorder == true){
        setSortData({        
            column: event.target.id,
            order: "asc"
        })
    }
    else{
        setSortData({        
            column: event.target.id,
            order: "desc"
        })
    }
    loadInitialGridData()
    }



    return (
    <div>
        <div>
        <h3>Manage Cutomers</h3>
        </div>

        <div className='top'>
            
            <input type="text" placeholder='Search the first name' onChange={(event)=>setsearchData(event.target.value)}/>
            <button onClick={()=>loadInitialGridData()}>Search</button>
            
            <button onClick={()=>{
                setHideOrShowFilter(!hideOrShowFilter)
                fetchMembershipDropdown()}}>Filter</button>
``
            <div hidden={hideOrShowFilter}>
                <label htmlFor="membership" className='labels'>Membership </label>
                <select id='membership' onChange={(event) => {
                    fetchLocationDropdown(event)
                    setFilterData({...filterData, ["membership"]:event.target.value})
                }}> 
                    <option disabled selected>Select</option>
                    {bindMembershipDropdown()}
                    
                </select>
                
                <label htmlFor="location" className='labels'>Location </label>
                <select  id='location' onChange={(event) => {
                    setFilterData({...filterData, ["location"]:event.target.value})
                }}> 
                    <option disabled selected >Select</option>
                    {bindLocationDropdown()}
                </select>

                <label htmlFor='Status' className='labels'> Status </label>
                <input type="radio" name="Status" id="Active" onChange={()=>{
                    setFilterData({...filterData,["status"]:"active"})}} /> <label htmlFor="Active"> Active </label>
                <input type="radio" name="Status" id="InActive" onChange={()=>{
                    setFilterData({...filterData,["status"]:"inactive"})}} /> <label htmlFor="inActive"> Inactive </label>

                <button onClick={()=>setHideOrShowFilter(true)  }>Cancel</button>
                <button onClick={loadInitialGridData}>Apply</button>
            </div>
            <button onClick={()=>navigate('/form')}>Add new customer</button>
        </div>
        
        <div>
            <thead>
                <tr>
                    <th className='head'>Cutomer ID <span><button id='user_id' onClick={(event) => {
                        onClickSort(event)}}>sort</button></span></th>
                    <th className='head'>First Name <span><button id='first_name' onClick={(event) => {
                        onClickSort(event)
                        }}>sort</button></span></th>
                    <th className='head'>Last Name <span><button id='last_name' onClick={(event) => {
                        onClickSort(event)}}>sort</button></span></th>
                    <th className='head'>Email Address <span><button id='email_id' onClick={(event) => {
                        onClickSort(event)}}>sort</button></span></th>
                    <th className='head'>Membership</th>
                    <th className='head'>Location</th>
                    <th className='head'>Status</th>
                    <th className='head'>Actions</th>
                </tr>
            </thead>

            <tbody>
                {bindGridData()}
            </tbody>
        </div>
        <div className='loadmore'>
            <button onClick={()=>{ 
                setLoadMoreData(loadMoreData+10)
            }}>Load More</button>
        </div>
    </div>
  )
}

