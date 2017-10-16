import { createPersistor, getStoredState } from 'redux-persist';
import localForage from 'localforage';
import { skipRehydration } from './actions';

const persistConfig = {
  storage: localForage,
  keyPrefix: 'phlashy:',
  blacklist: ['router']
}

async function handlePersistence(store) {

  // persist the store
  const persistor = createPersistor(store, persistConfig);
  persistor.pause();

  // handle rehydration
  try {
    let { user } = store.getState();
    if(user) {
      let storedState = await getStoredState(persistConfig);
      if(storedState.user && storedState.user.id == user.id)
        persistor.rehydrate(storedState);
      else
        store.dispatch( skipRehydration() );
    } else {
      persistor.purge();
    }
  } catch(e) { console.log(e) }

  persistor.resume();
}

export default handlePersistence;
