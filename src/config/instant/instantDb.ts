import { init } from '@instantdb/react-native';
import schema from '../../../instant.schema';

// ID for app: asistencia
const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID || '';

console.log(APP_ID);
export const instantDb = init({ appId: APP_ID, schema: schema });
