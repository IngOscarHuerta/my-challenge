import './App.css';
import Webpages from './pages';
import { Provider } from 'react-redux';
import store from './store'

function App() {
  return (
    <Provider store={store}>
      <Webpages />
    </Provider>
  );
}

export default App;
