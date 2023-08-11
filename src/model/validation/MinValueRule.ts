import { 
  ERROR_INVALID_VALUE, 
  type FailureExplanation,
  type ValidationRule
} from './Validation';
import { ValidationUtil } from './ValidationUtil';

export class MinValueRule implements ValidationRule {

  name = 'MinValueRule';
  exclusive: boolean;

  constructor(private min: any,
    private options: { exclusive: boolean }|null = null,
    private errorCode: string = ERROR_INVALID_VALUE,
  ) {
    this.exclusive = (options && options.exclusive) || false;
  }

  validate(value: any): FailureExplanation|null {
    // always accept 'empty value'
    if (ValidationUtil.isEmptyValueForRule(typeof this.min, value)) {
      return null;
    }
    // always reject 'nonsense value'
    if (ValidationUtil.isNonSenseValueForRule(typeof this.min, value)) {
      return { reason: this.errorCode };
    }
    
    if (value !== null && this.exclusive && value === this.min) {
      return { reason: this.errorCode };
    } else if (value !== null && value < this.min) {
      return { reason: this.errorCode };
    } else {
      return null;
    }
  }

}
