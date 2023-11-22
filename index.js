const express = require('express')
const uuid = require('uuid')
const app = express()
const port = 3000
app.use(express.json())

const orders = []




const checkUserId = (request, response, next) => {
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })
    }

    request.userIndex = index
    request.userId = id

    next()
}




const methodUrl = (request, response, next) => {
    console.log(request.method, request.url)

    next()
}





app.get('/orders', methodUrl, (request, response) => {
    return response.json(orders)
})





app.post('/orders', methodUrl, (request, response) => {
    const { order, clientName, price } = request.body

    const newOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})





app.put('/orders/:id', checkUserId, methodUrl, (request, response) => {

    const { order, clientName, price } = request.body
    const index = request.userIndex
    const id = request.userId

    const updateOrder = { id, order, clientName, price, status: "Em preparação" }
    
    orders[index] = updateOrder

    return response.json(updateOrder)

})





app.get('/orders/:id', checkUserId, methodUrl, (request, response) => {

    const index = request.userIndex

    const searchOrder = orders[index]
    return response.json(searchOrder)

})





app.delete('/orders/:id', checkUserId, methodUrl, (request, response) => {

    const index = request.userIndex

    orders.splice(index, 1)
    return response.status(204).json()

})





app.patch('/orders/:id', checkUserId, methodUrl, (request, response) => {

    const index = request.userIndex

    const updateStatus = orders[index]
    updateStatus.status = "Pronto"
    return response.json(updateStatus)

})





app.listen(port, () => {
    console.log(`🛜  Server starded on port ${port}`)
})