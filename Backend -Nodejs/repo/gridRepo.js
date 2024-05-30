const sql = require("mssql")
const { dbConfig } = require("../config/constant")


const executeQuery = async (dataQuery) => {

    try {
        const connection = await sql.connect(dbConfig)
        console.log(dataQuery);
        let rows = await connection.query(dataQuery)
        return rows
        connection.close
    } catch (error) {
        console.log(error.message);
    }
}

const postInitialGridData = async (req, res) => {
    let dataQuery = ""
    const body = req.body
    const columns = 'user_id,first_name,last_name,email_id,gender,date_of_birth,contact,status,membership,location,car_model,transmission_type,fuel_type'
    if(body.loadMore ==0 && body.filterData.membership =="" && body.filterData.location =="" && body.filterData.status ==null){
        dataQuery = `Select top 10 ${columns} from usermanagement.customerData`
        if(body.sortData.column !=""){
            dataQuery = `Select top 10 ${columns} from usermanagement.customerData ORDER BY ${body.sortData.column}  ${body.sortData.order} `
        }
    }
    if(body.loadMore != 0 && body.filterData.membership =="" && body.filterData.location =="" && body.filterData.status ==null ){
        dataQuery = `Select ${columns} from usermanagement.customerData ORDER BY user_id OFFSET ${body.loadMore} ROWS FETCH NEXT 10 ROWS ONLY  `
        if(body.sortData.column !=""){
            dataQuery = `Select top  ${body.loadMore}  ${columns} from usermanagement.customerData ORDER BY ${body.sortData.column}  ${body.sortData.order} `
        }
    }
    if(body.filterData.membership !="" && body.filterData.location !="" && body.filterData.status !=null){
        dataQuery = `Select ${columns}  from usermanagement.customerData where membership = '${body.filterData.membership}' and location = '${body.filterData.location}' and status = '${body.filterData.status}' `
    }
    if(body.filterData.membership =="" && body.filterData.location =="" && body.filterData.status !=null){
        dataQuery = `Select ${columns}  from usermanagement.customerData where status = '${body.filterData.status}' `
    }
    if(body.filterData.membership !="" && body.filterData.location =="" && body.filterData.status ==null){
        dataQuery = `Select ${columns}  from usermanagement.customerData where membership = '${body.filterData.membership}' `
    }
    if(body.filterData.membership !="" && body.filterData.location !="" && body.filterData.status ==null){
        dataQuery = `Select ${columns}  from usermanagement.customerData where membership = '${body.filterData.membership}' and location = '${body.filterData.location}' `
    }
    if(body.search !=""){
        dataQuery = `Select ${columns}  from usermanagement.customerData where first_name like '%${body.search}%'`
    }

    const responseData = await executeQuery(dataQuery)
    res.status(200).send(responseData)
}

module.exports = { postInitialGridData }
