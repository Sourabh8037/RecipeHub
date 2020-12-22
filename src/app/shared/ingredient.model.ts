import { Units } from './enums';

export class Ingredient{
  constructor(public name:string, public amount:number, public unit:Units){}
}