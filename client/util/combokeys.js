/*
 * Make global instance of combokeys conveniently availble
 */

import Combokeys from 'combokeys';
import addGlobalBind from 'combokeys/plugins/global-bind'

const combokeys = new Combokeys(document);

addGlobalBind(combokeys);

export default combokeys;
