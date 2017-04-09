export class Sensor {
  payload: string;
  radio: string;
  nodeId: number;
  childSensorId: number;
  messageType: number;
  ack: number;
  subType: number;
}

export interface BackendMessage {
  func: string;
  status: object;
}

export interface AVState {
  func: string;
  status: {
    scene: string;
  };
}
