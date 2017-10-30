import keymaster from 'keymaster';

// remove global key variable
keymaster.noConflict();

// remove built-in global filtering of events in favor of local filtering
const filter = keymaster.filter;
keymaster.filter = e => true;

// scope stack
let scopeStack = ['base'], unique = 1;
const getScope = () => scopeStack[scopeStack.length - 1];

// initialize keymaster with base scope
keymaster.setScope( getScope() );

function kbs(key, method) {
  keymaster(key, getScope(), (e, handler) => {
    if( filter(e) )
      return method(e, handler);
  })
}

kbs.global = (key, method) => keymaster(key, getScope(), method);

kbs.unbind = (key) => keymaster.unbind(key, getScope());

kbs.newScope = (scope = unique++) => {
  scopeStack.push(scope);
  keymaster.setScope(scope);
}

kbs.restore = () => {
  if(scopeStack.length > 1) {
    keymaster.deleteScope( scopeStack.pop() );
    keymaster.setScope( getScope() );
  }
}

export default kbs;
