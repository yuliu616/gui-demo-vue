import { 
  ERROR_INVALID_VALUE, 
  FailureExplanation,
  ValidationRule
} from './Validation';

export class MinValueRule implements ValidationRule {

  constructor(private min: any) {
  }

  validate(value: any): FailureExplanation|null {
    if (value !== null && value < this.min) {
      return { reason: ERROR_INVALID_VALUE };
    } else {
      return null;
    }
  }

}
