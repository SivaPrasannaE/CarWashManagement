const sql = require("mssql")
const {dbConfig} = require("../config/constant")

const executeQuery = async(dataQuery) =>{
    try {
        console.log(dataQuery);
        const connection = await sql.connect(dbConfig)
        let rows = await connection.query(dataQuery)
        return rows
        connection.close
    } catch (error) {
        console.log(error.message);
    }
}

const getDropdownData = async (req,res) => {
    try {

    const dataQuery = 'Select membership_name from usermanagement.memberships; Select car_model from usermanagement.carmodels'
    
    const responseData = await executeQuery(dataQuery)
    
    const responseDataArray = {
        row1:responseData.recordsets[0],
        row2:responseData.recordsets[1]
    }
    console.log(responseDataArray)
    
    res.status(200).send(responseDataArray)
        
    } catch (error) { 
        console.log(error.message);
    }
    
}

const postLocationData = async(req,res) => {
    try {
        
        const body = req.body
        console.log(body.membership);
        const dataQuery =  `Select location  from usermanagement.locations where membership_name = ('${body.membership}')`
        const responseData = await executeQuery(dataQuery)
        console.log(responseData.recordset);
        res.status(200).send(responseData.recordset)
    } catch (error) {
        console.log(error.message);
        
    }
    
}



const postUserData = async(req,res) => {
    try {
        let columns = []
        let rows = []
        let updateQuery = []

        for(const keys in req.body){
            if(req.body[keys] != null && keys != 'user_id'){
                columns.push(keys)
                rows.push(`'${req.body[keys]}'`)
                updateQuery.push(keys+"="+`'${req.body[keys]}'`)
            }
            else{
                console.log("Validation error");
            }

        }
        columns = columns.join()
        rows = rows.join()
        updateQuery = updateQuery.join()
        if(req.body.user_id == undefined){
            dataQuery = `insert into usermanagement.customerData (${columns}) values (${rows})`
        }
        else{
            dataQuery = `update usermanagement.customerData set ${updateQuery} where user_id =  ${req.body.user_id} `
        }
        const responseData = await executeQuery(dataQuery)
        if(responseData.rowsAffected == 1){
            res.status(200).send(responseData)
        }
        else{
            res.status(201).send("No datas entried")
        }
    }    
    
    catch (error) {
        console.log(error.message);
    }
    
}

module.exports = {getDropdownData,postLocationData,postUserData}
