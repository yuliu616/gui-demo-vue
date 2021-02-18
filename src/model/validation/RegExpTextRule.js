import { 
  ERROR_INVALID_FORMAT, 
} from './Validation';

export class RegExpTextRule {

  constructor(pattern) {
    this.pattern = pattern;
  }

  validate(value){
    if (!this.pattern.test(value)) {
      return { reason: ERROR_INVALID_FORMAT };
    } else {
      return null;
    }
  }

}
