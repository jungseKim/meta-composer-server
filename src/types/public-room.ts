// export interface RoomList {
//   rooms: Room[];
// }
export interface PublicRoom {
  id: string;
  userId: string;
  roomKey: string;
  onAir: boolean | string;
  title: string;
}
