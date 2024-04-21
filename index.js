const { Server } = require("socket.io");

const io = new Server(4000, {
    cors: true
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map()

io.on('connection', (socket) => {
    // console.log(`Socket connected ${socket.id}`)
    socket.on('room:join', (data) => {
        // console.log(data)
        const { email, room } = data
        emailToSocketIdMap.set(email, socket.id)
        socketIdToEmailMap.set(socket.id, socket.email)
        io.to(room).emit("user:joined", { email, id: socket.id })
        socket.join(room)
        io.to(socket.id).emit('room:join', data)
    })

    socket.on("user:call",({to,offer})=>{
        io.to(to).emit("incoming:call",{from:socket.id,offer})
    })
    socket.on('call:accepted',({to,ans})=>{
        io.to(to).emit('call:accepted',{from :socket.id , ans})
    })
    socket.on("peer:nego:needed",({to,offer})=>{
        io.to(to).emit("peer:nego:needed",{from:socket.id,offer})
    })
    socket.on("peer:nego:done",({to,ans})=>{
        io.to(to).emit("peer:nego:final",{from:socket.id,ans});
    })

})