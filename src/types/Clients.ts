import { Socket } from 'socket.io';

export default interface Clients {
  [key: string]: Socket[];
}

// import { Socket } from 'socket.io';

// interface Client {
// [key: string]: Socket;
//   userId:string;
//   socket:Socket
// }

// export default interface Clients {
//   [key: string]: Client;
//socketID
// }
