import { AVScene } from './av-scene';
import { Room } from './room';
import { IMqttServiceOptions } from 'ngx-mqtt';

export interface ConfigurationDTO {
    scenes: AVScene[],
    rooms: Room[],
    mqtt: IMqttServiceOptions,
    endpoints: {
        chromecast: string
    }
}
