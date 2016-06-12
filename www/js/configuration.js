 configuration = {
     "tabla" : 0,
     "chromosomeSize": 10, // Amount of genes to form chromosome {Number} [1 o más]
     "popSize": 50, // Size of the population {Number} [1 o más]
     "repeated": true, // True if repeated elements are admitted {Boolean} [True/False]
     "percentMutation": 2, // Percentage of items that are mutated in each generation {Number} [0 o más]
     "percentCrossOver": 75, // Ppercentage of items that are a result of crosses in the next generation [0 o más]
     "genes": ["1","0","A"], // List all possible genes to form a chromosome {String[]}
     "isValid": new Functions().isValidRoute, // A function that returns true if an element passed as parameter is valid @return {Boolean}
     "fitnessFunction": new Functions().fitnessRouteFunction, // A function that returns the value of fitness of a element past as a parameter @return {Number}
     "initialization": new Functions().initialization, // A function that returns a new population @return {Element[]}
     "evaluation": new Functions().evaluate, // A function that returns a population with the corresponding fitness values of its elements @return {Element[]}
     "selection": new Functions().rouletteWheelSelection, // A function that returns the elements of a population selected parents @return {Element[]}
     "crossover": new Functions().randomOverNoValidCrossover, // A function that returns the elements of a population after crossing operations @return {Element[]}
     "mutation": new Functions().mutation, //A function that returns the elements of a population after mutation operations @return {Element[]}
     "evolution": new Functions().allValidsEvolution // A function that returns the elements of the next generation @return {Element[]}
 };
