export class ObjectHelper {


  /**
   * with the provided object (key/value pairs),
   * create a clone of it with all value replaced 
   * with a default value.
   */
  public static cloneWithValueReset(target: {[_:string]: any}, fieldDefault: any){
    let clone: any = {};
    for (let key in target) {
      clone[key] = fieldDefault;
    }
    return clone;
  }

  /**
   * with the provided object (key/value pairs),
   * assume all value is in same type (A),
   * iterate all those values and convert them to type (B)
   */
  public static map<A, B>(target: {[_:string]: A}, 
    converter: (value:A)=>B,
  ): {[_:string]: B} {
    let clone: {[_:string]: B} = {};
    for (let key in target) {
      let value : A = target[key];
      clone[key] = converter(value);
    }
    return clone;
  }

}
