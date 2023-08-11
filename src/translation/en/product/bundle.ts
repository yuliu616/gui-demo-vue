import { message } from './message';
import { word } from './word';
import { error } from './error';
import { Product } from './Product';
import { Brand } from './Brand';

const bundle = {
  message,
  word,
  error,
  model: {
    Product,
    Brand,
  },
};

export { bundle }
