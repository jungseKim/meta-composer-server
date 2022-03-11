// export interface RoomList {
//   rooms: Room[];
// }
export interface Room {
  id: string;
  userId: string;
  roomId: string;
  onAir: boolean | string;
  title: string;
}
