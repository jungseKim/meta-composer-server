export default interface OfferPayload {
  userId?: number;
  roomId?: string;
  data: RtcData;
}
interface RtcData {
  sdp: string;
  type: 'answer' | 'offer' | 'pranswer' | 'rollback';
}
