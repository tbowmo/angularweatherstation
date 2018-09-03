// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { IMqttServiceOptions } from 'ngx-mqtt';

const mqtt: IMqttServiceOptions = {
  hostname: 'mqtt.juletraesfoden.dk',
  port: 443,
  protocol: 'wss',
  path: ''
};

export const environment = {
  production: false,
  MQTT_SERVICE_OPTIONS: mqtt
};
