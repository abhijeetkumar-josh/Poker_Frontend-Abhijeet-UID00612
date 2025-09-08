// const PORT:number= 8050

// export const PokerGame=(roomName:number)=>{
//     const socket = new WebSocket(`ws://127.0.0.1:${PORT}/ws/poker/${roomName}/`);
    
//     socket.onopen = () => {
//       console.log("WebSocket connected");
//       socket.send(JSON.stringify({ message: "Hello from client!" }));
//     };
    
//     socket.onmessage = (e) => {
//       const data = JSON.parse(e.data);
//       console.log("Message from server:", data.message);
//     };
// }


