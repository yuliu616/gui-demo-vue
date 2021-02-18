export const ERROR_REQUIRED_FIELD = 'ERROR_REQUIRED_FIELD';
export const ERROR_INVALID_FORMAT = 'ERROR_INVALID_FORMAT';
export const ERROR_INVALID_VALUE = 'ERROR_INVALID_VALUE';

/**
 * 
 * @param {string} action : 'update' or 'create'
 * @returns {object} : key = field, value = failure object (null if all passed)
 */
export function validateModel(modelClass, model, action) {
  let errors = {};
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
