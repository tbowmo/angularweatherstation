import { MqttServiceOptions } from 'ngx-mqtt';

const mqtt: MqttServiceOptions = {
  hostname: 'juletraesfoden.dk',
  port: 443,
  protocol: 'wss',
  path: '/mqtt'
};

export const environment = {
  production: true,
  MQTT_SERVICE_OPTIONS: mqtt
};
