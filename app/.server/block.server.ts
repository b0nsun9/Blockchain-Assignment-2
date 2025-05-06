import { Timestamp, GeoPoint } from "firebase-admin/firestore"

export interface AttendanceData {
  timeStamp: Timestamp;
  location: GeoPoint;
  userId: string;
  eventId: string;
}

export interface EventData {
  id: string;
  name: string;
  createdBy: string;
}

export interface Block {
  index: number;
  previousHash: string;
  timeStamp: Timestamp;
  attendanceData?: AttendanceData;
  eventData?: EventData;
  nonce: number;
  hash: string;
}

export interface Chain {
  blocks: [Block]
}