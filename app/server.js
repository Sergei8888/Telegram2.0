const express = require("express"),
    app = express(),
    cors = require("cors"),
    http = require("http").Server(app),
    io = require("socket.io")(http),
    port = 2600;

app.use(cors())
app.use(express.static('client'));

app.get("/favicon.ico", (req, res) => {
    res.sendFile(__dirname + "/client/img/favicon.ico")
})

let clients = [], // Список подключенных сокетов (юзверей)
    chatData = {} // Хранилище данных чата

io.on("connection", (socket) => {
    clients.push(socket) // Добавляю нового юзверя в список активных подключений
    console.log("User connected")
    if (clients.length == 1) { // Если это первое подключение создаю шаблон данных
        chatData = {
            messages: [{
                text: "Hello Node.js + Express.js + Socket.io",
                userId: socket.id
            }]
        }
    }

    socket.emit('renderChatHistory', chatData.messages)

    socket.on('chat message', (msg) => {
        chatData.messages.push({
            text: msg.text,
            userId: msg.userId
        })
        io.emit('chat message', {
            text: msg.text,
            userId: msg.userId
        })
    })
    socket.on('disconnect', () => {
        clients.shift()
        console.log("User disconnected")
    })
})

http.listen(port, () => {
    console.log("Server started")
})