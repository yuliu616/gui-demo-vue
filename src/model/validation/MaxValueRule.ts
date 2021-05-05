import { 
  ERROR_INVALID_VALUE, 
  FailureExplanation,
  ValidationRule
} from './Validation';
import { ValidationUtil } from './ValidationUtil';

export class MaxValueRule implements ValidationRule {

  name = 'MaxValueRule';
  exclusive: boolean;

  constructor(private max: any,
    private options: { exclusive: boolean }|null = null,
    private errorCode: string = ERROR_INVALID_VALUE,
  ) {
    this.exclusive = (options && options.exclusive) || false;
  }

  validate(value: any): FailureExplanation|null {
    // always accept 'empty value'
    if (ValidationUtil.isEmptyValueForRule(typeof this.max, value)) {
      return null;
    }
    // always reject 'nonsense value'
    if (ValidationUtil.isNonSenseValueForRule(typeof this.max, value)) {
      return { reason: this.errorCode };
    }

    if (value !== null && this.exclusive && value === this.max) {
      return { reason: this.errorCode };
    } else if (value !== null && value > this.max) {
      return { reason: this.errorCode };
    } else {
      return null;
    }
  }

}
