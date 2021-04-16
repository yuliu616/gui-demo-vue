import { ModelDef } from "../ModelDef";
import { ERROR_REQUIRED_FIELD, ValidationResult } from "./Validation";

export class ValidationUtil {

  public static validateModel(modelClass: ModelDef, 
    model: any, action: 'update' | 'create',
  ): ValidationResult|null {

    let errors: ValidationResult = {};
    for (let f of Object.keys(modelClass.fields)) {
      let fieldMeta = modelClass.fields[f];
      let v = model[f];
      
      // check for required
      if (fieldMeta.required) {
        if (fieldMeta.type === 'string') {
          if (!v || v.trim() === '') {
            errors[f] = { reason: ERROR_REQUIRED_FIELD };
          }
        } else if (fieldMeta.type !== 'number' &&
        fieldMeta.type !== 'boolean') 
        {
          if (!v) {
            errors[f] = { reason: ERROR_REQUIRED_FIELD };
          }
        }
      }

      // check for rules
      if (!errors[f] && fieldMeta.rules) {
        for (let rule of fieldMeta.rules) {
          let ruleResult = rule.validate(v);
          if (ruleResult) {
            errors[f] = ruleResult;
            break;
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return errors;
    } else {
      return null;
    }
  }

}
