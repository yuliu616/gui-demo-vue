import type { ILogger } from "@/model/core/ILogger";

const logger: ILogger = console;

export class ObjectUtil {

  /**
   * with the provided object (key/value pairs),
   * create a clone of it with all value replaced 
   * with a default value.
   */
  public static cloneWithValueReset(
    target: {[_:string]: any}, fieldDefault: any,
  ): {[_:string]: any} {
    let clone: {[_:string]: any} = {};
    for (let key in target) {
      clone[key] = fieldDefault;
    }
    return clone;
  }

  /**
   * for the provided array (list of objects),
   * pick the target 'field' from each item,
   * merge them into one object, with key = value of the field,
   * value with the provided data.
   */
  public static reduceAsPropertyBag<T>(
    array: {[_:string]: any}[], field: string, value: T,
  ): {[_:string]: T} {
    let bag: {[_:string]: any} = {};
    for (let it of array) {
      let key = it[field];
      bag[key] = value;
    }
    return bag;
  }

  /**
   * for all keys of a PropertyBag,
   * if the value of it pass the provided 'predicate',
   * collect it.
   * @returns array of keys that matches.
   */
  public static getKeyListOfPropertyBag<T>(
    bag: {[_:string]: T}, predicate: (_:T)=>boolean,
  ): string[] {
    let matches: string[] = [];
    for (let key in bag) {
      let value: T = bag[key];
      if (predicate(value)) {
        matches.push(key);
      }
    }
    return matches;
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
      // logger?.log(`traverseObjectGraph: field=[${field}] isLeaf=${isLeaf}.`);
      if (isLeaf) {
        operationOnLeaf(pathOfNode, nodeValue);
      } else {
        this.traverseObjectGraph(nodeValue, predicateValueIsLeaf, operationOnLeaf, pathOfNode);
      }
    }
  }

  public static allFields(obj: any): string[] {
    let fields: string[] = [];
    for (let f of Object.keys(obj)) {
      if (typeof obj[f] != 'function' &&
      typeof obj[f] != 'symbol') {
        fields.push(f);
      }
    }
    return fields;
  }

}
