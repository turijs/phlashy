import { createPersistor, getStoredState, createTransform } from 'redux-persist';
import localForage from 'localforage';
import { skipRehydration } from './actions';

// only persist the user's ID
const transformUser = createTransform(
  (user, _) => user && {id: user.id},
  null,
  {whitelist: 'user'}
);

const persistConfig = {
  storage: localForage,
  keyPrefix: 'phlashy:',
  whitelist: [
    'user',
    'decks',
    'cards',
    'prefs',
    'study',
    'outbound'
  ],
  transforms: [transformUser]
};

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
