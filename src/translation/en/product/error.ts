import { error as generalError } from '../error';

let scopedError = {
};
const merged = Object.assign({}, generalError, scopedError);

export { merged as error };
