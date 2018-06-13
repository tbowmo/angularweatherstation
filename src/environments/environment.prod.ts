import { IMqttServiceOptions } from 'ngx-mqtt';

const mqtt: IMqttServiceOptions = {
  hostname: 'mqtt.juletraesfoden.dk',
  port: 443,
  protocol: 'wss',
  path: ''
};

export const environment = {
  production: true,
  MQTT_SERVICE_OPTIONS: mqtt
};
