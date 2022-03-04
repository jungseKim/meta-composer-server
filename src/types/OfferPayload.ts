// export default interface OfferPayload {
//   userId?: number;
//   roomId?: string;
//   data: RtcData;
// }
export default interface RtcData {
  sdp: string;
  type: 'answer' | 'offer' | 'pranswer' | 'rollback';
}
