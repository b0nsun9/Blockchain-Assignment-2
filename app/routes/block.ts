interface AttendanceData {
  loc_lat: number;
  loc_lng: number;
  attend_event_id: string;
}

interface Block {
  index: number;
  timestamp: number;
  data: [AttendanceData];
  previousHash: string;
  nonce: number;
  hash: string;
}

interface Chain {
  blocks: [Block];
}