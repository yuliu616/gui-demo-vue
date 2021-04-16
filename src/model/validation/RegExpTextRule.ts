import { 
  ERROR_INVALID_FORMAT,
  FailureExplanation,
  ValidationRule 
} from './Validation';

export class RegExpTextRule implements ValidationRule {

  constructor(private pattern: RegExp) {
  }

  validate(value: any): FailureExplanation|null {
    if (!this.pattern.test(value)) {
      return { reason: ERROR_INVALID_FORMAT };
    } else {
      return null;
    }
  }

}
