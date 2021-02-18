import { 
  ERROR_INVALID_VALUE, 
} from './Validation';

export class MinValueRule {

  constructor(min) {
    this.min = min;
  }

  validate(value){
    if (value !== null && value < this.min) {
      return { reason: ERROR_INVALID_VALUE };
    } else {
      return null;
    }
  }

}
