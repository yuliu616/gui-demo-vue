import { error as generalError } from '../error';

let scopedError = {
  'ERROR_INVALID_NAME': 'Name should be either English only, Chinese only, but not both',
  'ERROR_TOO_SHORT_FOR_A_HUMAN': 'Short like this can\'t be a human',
  'ERROR_TOO_LIGHT_FOR_A_HUMAN': 'I don\'t think this weight could be a human',
  'TOO_MANY_WIFE': 'Unfortunately, man could not marry with {0} women',
};
const merged = Object.assign({}, generalError, scopedError);

export { merged as error };
