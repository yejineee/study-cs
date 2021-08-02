function greet(person: string, date: Date) {
  let a ;
  console.log(`Hello ${person}, today is ${date.toDateString()}!`);
}

greet("Maddison", new Date());