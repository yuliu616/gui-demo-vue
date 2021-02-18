import { 
  ERROR_INVALID_VALUE, 
} from './Validation';

export class MaxValueRule {

  constructor(max) {
    this.max = max;
  }

  validate(value){
    if (value !== null && value > this.max) {
      return { reason: ERROR_INVALID_VALUE };
    } else {
      return null;
    }
  }

}
