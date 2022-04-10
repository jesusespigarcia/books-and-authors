import configDevelop from './config.development';
import configProduction from './config.production';
import configTest from './config.test';

let config = configDevelop;
if (process.env.NODE_ENV === 'production') {
  config = configProduction;
}
if (process.env.NODE_ENV === 'test') {
  config = configTest;
}
export default () => ({
  ...config,
  'jwt.secret': process.env.JWT_SECRET,
  'login.user': process.env.LOGIN_USER,
  'login.password': process.env.LOGIN_PASSWORD,
  'db.connectionUri': process.env.DB_CONNECTION_URI,
});
