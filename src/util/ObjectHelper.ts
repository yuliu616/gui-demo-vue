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

  /**
   * traverse all node in the target object and build up a path (dot notation)
   * @param target 
   * @param predicateValueIsLeaf predicate function called on all node found 
   * to determine is it a leaf
   * @param operationOnLeaf function called on all leaf found
   * @param pathSoFar path inside the object, using dot notation.
   */
  public static traverseObjectGraph(
    target: any, 
    predicateValueIsLeaf: (path:string, _:any)=>boolean,
    operationOnLeaf: (path:string, _:any)=>any,
    pathSoFar: string|null = null, 
  ){
    let keys = Object.keys(target);
    for (let field of keys) {
      let nodeValue = target[field];
      let pathOfNode = (pathSoFar ? pathSoFar + '.' + field : field);
      if (typeof nodeValue != 'boolean' && !nodeValue) {
        // skip null/empty value
        continue;
      }
      let isLeaf = predicateValueIsLeaf(pathOfNode, nodeValue);
      // console.log(`traverseObjectGraph: field=[${field}] isLeaf=${isLeaf}.`);
      if (isLeaf) {
        operationOnLeaf(pathOfNode, nodeValue);
      } else {
        this.traverseObjectGraph(nodeValue, predicateValueIsLeaf, operationOnLeaf, pathOfNode);
      }
    }
  }

}
