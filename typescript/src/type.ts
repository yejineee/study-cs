// ts - string
const str: string = 'hello';
// ts - number
const num: number = 10;
// ts - boolean
const done: boolean = true;

const strArr : string[] = ['a', 'b'];
const numArr : number[] = [1,2]
const num2Arr: [number] = [1];
   
// const obj: object = {};
// obj.func(); // property func does not exist on type 'object'

const obj2: any = {};
obj2.func(); // no error



function coordinate(point:{x:number, y:number, z?:number}){
  if(point.z !== undefined){

  }
}

coordinate({x:1, y:2}); // OK
coordinate({x:1, y:2, z:3}) // OK