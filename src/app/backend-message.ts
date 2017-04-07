export interface Sensor {
  payload : string;
  radio : string;
  nodeId : number;
  childSensorId : number;
  messageType : number;
  ack : number;
  subType : number;
}

export interface Chrome {

}
export interface BackendMessage {
  func : string;
  status : object;
}
