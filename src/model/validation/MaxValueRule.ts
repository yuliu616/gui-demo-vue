import { 
  ERROR_INVALID_VALUE, 
  FailureExplanation,
  ValidationRule
} from './Validation';

export class MaxValueRule {

  constructor(private max: any) {
  }

  validate(value: any): FailureExplanation|null {
    if (value !== null && value > this.max) {
      return { reason: ERROR_INVALID_VALUE };
    } else {
      return null;
    }
  }

}
