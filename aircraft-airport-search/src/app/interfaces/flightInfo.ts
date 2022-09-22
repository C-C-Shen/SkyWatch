export interface coordinates {
  name: string;
  longitude: number;
  latitude: number;
};

export interface flightInfo {
  call: string;
  start: coordinates;
  end: coordinates;
};
