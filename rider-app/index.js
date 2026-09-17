import { URL, URLSearchParams } from 'react-native-url-polyfill';
global.URL = URL;
global.URLSearchParams = URLSearchParams;
import { registerRootComponent } from 'expo';
import App from './App';
registerRootComponent(App);
