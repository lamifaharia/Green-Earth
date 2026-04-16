1) Difference between var, let, and const?

var: The old way. It can be redefined and leaked out of blocks, which causes bugs.

let: Modern way to save values that will change later. It stays inside the block where you create it.

const: Used for values that shouldn't change. Once set, you can't give it a new value.

2) Difference between map(), forEach(), and filter()?

forEach(): Just a loop to do something with each item (no new array).

map(): Changes every item and gives you a new array of the results.

filter(): Picks only the items that pass a test and puts them in a new array.

3) What are arrow functions?
A shorter way to write functions using => instead of the function keyword. It makes the code cleaner and is very common in React.

4) How does destructuring work?
It’s a shortcut to "grab" values from objects or arrays. Instead of writing user.name, you can just write { name } to pull the name out directly into a variable.

5) What are template literals?
Using backticks (`) instead of quotes for strings. It’s better than concatenation because you can put variables directly inside using ${} without using a bunch of + symbols.