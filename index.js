const express = require("express")
const uuid = require("uuid")
const port = 3000
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request,response,next) =>{
    const {id} = request.params
    const index = orders.findIndex(order => id === order.id)

    if(index < 0 ){
        return response.status(404).json({error: "Order not found"})
    }
    request.orderIndex = index
    request.orderId = id

    next()
}
const printing = (request,response,next) =>{
    console.log(request.method, request.url)
    next()
}

app.get("/orders", printing,(request,response) =>{
    return response.json(orders)   
})
app.post("/orders", printing,(request,response) =>{

    const {order,nameClient,price} = request.body
    const client = {id:uuid.v4(), order, nameClient, price, status:"Em preparação"}
    orders.push(client)
    return response.status(201).json(client)   
})
app.put("/orders/:id", checkOrderId, printing, (request,response) =>{

    const id = request.orderId
    const index = request.orderIndex
    
    const {order, nameClient,price,status} = request.body

    const updateOrder = {id,order,nameClient,price,status}

    
    orders[index] = updateOrder
    return response.json(updateOrder)
    
})
app.delete("/orders/:id", checkOrderId, printing,(request,response) =>{

    const index = request.orderIndex
    orders.splice(index,1)

    return response.json()
    
})
app.get("/orders/:id", checkOrderId, printing,(request,response) =>{

    const index = request.orderIndex
    console.log(orders[index])
    return response.json()
    
})
app.patch("/orders/:id", checkOrderId, printing,(request,response) =>{

    const index = request.orderIndex
    orders[index].status = "Pronto"

    return response.json()
    
})


app.listen(port,() =>{
    console.log(`Server started on port ${port}`)
})