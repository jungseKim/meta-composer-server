export default interface OfferPayload {
  userId: string;
  data: RtcData;
}
interface RtcData {
  sdp: string;
  type: 'answer' | 'offer' | 'pranswer' | 'rollback';
}
