/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * @fileOverview Script to make easy the creation and reuse of generic genetic algorithms, it allows to use a standard configuration or own functions created by the user.
 * @author Rafael Castillo Alcaraz
 **/

/**
 * @class Defines the model of an element to be used in a genetic algorithm.
 *
 * @property {number} id - A value that identifies the element.
 * @property {string[]} chromosome - A series of strings, each representing a gene, and the full array a chromosome.
 * @this {Element}
 *
 **/

 var variable = "Adios";

function Element(id, chromosome, fitness) {
    /** @lends Element# */

    /**
     * A value that indicates the quality of that chromosome to solve a problem.
     *
     * @private
     * @name Element#id
     * @type number
     */
    this.id = id;

    /**
     * A series of strings, each representing a gene, and the full array a chromosome.
     *
     * @private
     * @name Element#chromosome
     * @type string[]
     */
    this.chromosome = chromosome;

    /**
     * A value that indicates the quality of that chromosome to solve a problem.
     *
     * @private
     * @name Element#fitness
     * @type number
     */
    this.fitness = fitness;

    /**
     * A value defining how much is the probability that the element is chosen by a selection function.
     *
     * @private
     * @name Element#probability
     * @type number
     */
    this.probability = 0;

    /*************************** Getters & Setters **************************/

    /**
     * @function Element#getId
     *
     * @return {number} - Returns the id of the current element.
     */
    this.getId = function () {
        return this.id;
    }

    /**
     * @function Element#getChromosome
     *
     * @return {string[]} - Returns a copy of the current element’s chromosome.
     */
    this.getChromosome = function () {
        return this.chromosome.slice();
    }

    /**
     * @function Element#getFitness
     *
     * @return {number} - Returns current element’s fitness.
     */
    this.getFitness = function () {
        return this.fitness;
    }

    /**
     * @function Element#getProbability
     *
     * @return {number} - Returns current element’s probability
     */
    this.getProbability = function () {
        return this.probability;
    }

    /**
     * @function Element#setId
     * @description Sets current element’s id
     *
     * @param {number} id - A value that identifies the element.
     */
    this.setId = function (id) {
        this.id = id;
    }

    /**
     * @function Element#setChromosome
     * @description Set as current chromosome, a copy of the value entered as a parameter.
     *
     * @param {string[]} chromosome - A series of strings, each representing a gene, and the full array a chromosome.
     */
    this.setChromosome = function (chromosome) {
        this.chromosome = chromosome.slice();
    }

    /**
     * @function Element#setFitness
     * @description Sets current element’s fitness.
     *
     * @param {number} fitness - A value that indicates the quality of that chromosome to solve a problem.
     */
    this.setFitness = function (fitness) {
        this.fitness = fitness;
    }

    /**
     * @function Element#setProbability
     * @description Sets current element’s probability.
     *
     * @param {number} probability - A value defining how much is the probability that the element is chosen by a selection function.
     */
    this.setProbability = function (probability) {
        this.probability = probability;
    }

    /********************************* Utils *********************************/

    /**
     * @function Element#setGen
     * @description Replaces a gene on current element’s chromosome in the indicated position by the introduced gene as a parameter.
     *
     * @param {number} position - Position of the gene to be replaced within the chromosome.
     * @param {string} gen - The string that identifies the type of gene.
     */
    this.setGen = function (position, gen) {
        this.chromosome[position] = gen.slice();
    }

    /**
     * @function Element#getGen
     * @description Returns a copy of the gene within the chromosome that is in the position indicated as a parameter.
     *
     * @param {number} position - Position of the gene to be recovered.
     */
    this.getGen = function (position) {
        return this.chromosome[position].slice();
    }

    /**
     * @function Element#write
     * @description A function that returns a string with the chromosome’s values in a readable format.
     *
     * @return {string} - A string with id values, chromosome, fitness and probability separated by tabs.
     */
    this.write = function () {
        var result = "";
        result += "Id: " + this.id;
        result += "\tChromosome: ";
        for (var i = 0; i < this.chromosome.length; i++) {
            result += this.chromosome[i] + " ";
        }
        result += "\tFitness: " + this.fitness;
        result += "\tProbability: " + Math.round(this.probability * 100) / 100;
        return result;
    }

};

/**
 * @class It represents a collection of different functions to be used by a genetic algorithm.
 *
 * @this {Functions}
 **/

function Functions() {

    /** @lends Functions# */

    that = this;

    /**
     * @function Functions#initialization
     * @description It creates a new population.
     *
     * @param {number} size - Number of elements in the created population.
     * @param {number} chromosomeSize - chromosome length of each element.
     * @param {string[]} genes - the list of possible genes to be used by the algorithm.
     * @param {boolean} repeated - true if a chromosome can contain repeated elements.
     * @return {Element[]} population - returns an array of the created elements.
     */

    this.initialization = function (size, chromosomeSize, genes, repeated) {

        var population = [];
        var auxChromosome = [];

        // If repeated genes within the chromosome are allowed
        if (repeated) {
            for (var i = 0; i < size; i++) {
                for (var j = 0; j < chromosomeSize; j++) {
                    // Each element of the chromosome is a randomly chosen gene of genes list
                    auxChromosome[j] = genes[Math.floor(Math.random() * genes.length)];
                }
                population[i] = new Element(i, auxChromosome.slice(), 0);
            }
        }
        // If repeated genes within the chromosome aren’t allowed
        else {
            if (genes.length >= chromosomeSize) {
                for (var i = 0; i < size; i++) {
                    auxGenes = genes.slice();
                    for (var j = 0; j < chromosomeSize; j++) {
                        var rand = Math.floor(Math.random() * auxGenes.length);
                        // Each element of the chromosome is a randomly chosen gene of genes list
                        auxChromosome[j] = auxGenes[rand];
                        // The element already introduced in the list of candidate genes is removed
                        auxGenes.splice(rand, 1);
                    }
                    population[i] = new Element(i, auxChromosome.slice(), 0);
                }
            } else {
                console.log("There are not enough different genes that do not occur in a chromosome, given the size of the chromosome");
            }
        }
        return population;
    }

    /**
     * @function Functions#isValid
     * @description It scans a chromosome and decides whether it is valid or not.
     *
     * @param {string[]} chromosome - An array in which each element is a string that represents a gene.
     * @return {boolean} - Returns true always. Using this function invalid elements do not exist.
     */
    this.isValid = function (chromosome) {
        return true;
    }

    /**
     * @function Functions#isValidRoute
     * @description It scans a route chromosome and decides whether it is valid or not. It's a a solution for a particular TSP.
     *
     * @param {string[]} chromosome - An array in which each element is a string that represents a gene.
     * @return {boolean} - Returns true if there is not repeated genes. Using this function invalid elements do not exist.
     */

    this.isValidRoute = function (chromosome) {
        var sortedChromosome = chromosome["chromosome"].slice().sort();
        for(var i=0;i<sortedChromosome.length-1;i++){
            if (sortedChromosome[i].localeCompare(sortedChromosome[i+1]) == 0){
                return false;
            }
        }
        return true;
    }

    /**
     * @function Functions#fitnessFunction
     * @description Calculates and returns a given element’s fitness value. The fitness value is equal to the number of 1s in the chromosome.
     *
     * @param {Element} element - The element to calculate the fitness value.
     * @return {number} - Returns fitness value
     */
    this.fitnessFunction = function (element,tabla) {
        var fitness = 0;
        for (var i = 0; i < element.getChromosome().length; i++) {
            if (element.getChromosome()[i].localeCompare("1") == 0) {
                fitness++;
            }
        }
        return fitness;
    }

    /**
     * @function Functions#fitnessRouteFunction
     * @description Calculates and returns a given element’s fitness value for a particular TSP. The fitness value is equal to subtraction of the distance between the genes in km. The less the distance, the greater the fitness.
     *
     * @param {Element} element - The element to calculate the fitness value.
     * @param {Object} table - Table with data for the TSP.
     * @return {number} - Returns fitness value
     */

    this.fitnessRouteFunction = function (element,table) {
        var fitness = 0;
        for (var i = 0; i < element.getChromosome().length-1; i++) {
            var elemento1 = element.getChromosome()[i];
            var elemento2 = element.getChromosome()[i+1];      
            fitness += table[elemento1].distances[elemento2].distance;
        }
        fitness = -2*fitness;
        return fitness;
    }

    /**
     * @function Functions#evaluate
     * @description Assign its fitness value to each element of the population using the fitness function.
     *
     * @param {Element[]} population - A set of elements to calculate its fitness value.
     * @return {Element[]} - Returns a copy of @population after calculating the fitness value of each element.
     */
    this.evaluate = function (population,tabla) {
        var populationFitness = [];
        populationFitness = clonePopulation(population);
        for (var i = 0; i < populationFitness.length; i++) {
            populationFitness[i].setFitness(this.fitnessFunction(populationFitness[i],tabla));
        }
        return populationFitness;
    }

    /**
     * @function Functions#rouletteWheelSelection
     * @description Simulates roulette selection process (also called fitness selection). It allows the best individuals are chosen most likely, but also leaves open the possibility that smaller are elected.
     *
     * @population {Element[]} population - A set of elements of element type from wich parents are wanted to chosen for the next generation.
     * @return {Element[]} - Returns an array of the same size as @population formed by chosen parents.
     */

    this.rouletteWheelSelection = function (population) {
        var probPopulation = [];
        var parents = [];
        probPopulation = clonePopulation(population);
        sumFitness = 0;
        // Calculate probability
        for (var i = 0; i < probPopulation.length; i++) {
            sumFitness += probPopulation[i].getFitness();
        }
        for (var i = 0; i < probPopulation.length; i++) {
            probPopulation[i].setProbability(probPopulation[i].getFitness() / sumFitness);
        }

        // Sort array
        probPopulation.sort(function (a, b) {
            return a.getProbability() - b.getProbability();
        });

        // Make the roulette wheel
        for (var i = 1; i < probPopulation.length; i++) {
            probPopulation[i].setProbability(probPopulation[i].getProbability() + probPopulation[i - 1].getProbability());
        }

        // Turn the roulette wheel
        for (var i = 0; i < probPopulation.length; i++) {
            var rand = Math.random();
            for (var j = 0; j < probPopulation.length; j++) {
                if (rand <= probPopulation[j].getProbability()) {
                    parents[i] = new Element(probPopulation[j].getId(), probPopulation[j].getChromosome(), probPopulation[j].getFitness());
                    break;
                }
            }
        }
        return parents;
    }

    /**
     * @function Functions#crossover
     * @description Given a population it generates a set of children formed after mating of his parents. Mating is to take the first half of the first parent chromosome and the second half of the second father, to concatenate and form the child element. A percentage of children who will be the result of crosses is set, the rest will be the best elements of the population.
     *
     * @param {Element[]} parents - Elements chosen to reproduce after a selection function.
     * @param {Element[]} population - A set of Element type elements that are now the population.
     * @param {number} percent - Percentage of children who will be the calculated  as a result of crosses.
     * @param {string[]} genes -An array of strings that represents all possible genes that may be part of a chromosome.
     * @return {Element[]} - It must return the children that are result from a crossing a population process.
     */
    this.crossover = function (parents, population, percent, genes) { 
        var children = [];
        var auxPopulation = clonePopulation(population);
        var firstElement = Math.floor(parents.length * (100 - percent) / 100);

        function mating(element1, element2) {
            var childChromosome = [];
            var i = 0;
            // Half element1’s elements are inserted.
            while (i < element1.getChromosome().length / 2) {
                childChromosome[i] = element1.getChromosome()[i];
                i++;
            }
            // Half element2’s elements are inserted.
            while (i < element2.getChromosome().length) {
                childChromosome[i] = element2.getChromosome()[i];
                i++;
            }
            return childChromosome;
        }

        // Sort array
        auxPopulation.sort(function (a, b) {
            return b.getFitness() - a.getFitness();
        });

        for (var i = 0; i < firstElement; i++) {
            children[i] = cloneElement(auxPopulation[i]);
        }

        for (var i = firstElement; i < parents.length - 1; i++) {
            children[i] = new Element(i, mating(parents[i], parents[i + 1]), 0);
        }

        // The last child is the son of the last and the first element of @parents
        children[i] = new Element(i, mating(parents[parents.length - 1], parents[0]), 0);

        return children;
    }

    /**
     * @function Functions#randomOverNoValidCrossover
     * @description Given a population it generates a set of children formed after mating of his parents. Mating is to take the first half of the first parent chromosome and the second half of the second father, to concatenate and form the child element. A percentage of children who will be the result of crosses is set, the rest will be the best elements of the population. If a child is no valid, it is replaced by a random @element.
     *
     * @param {Element[]} parents - Elements chosen to reproduce after a selection function.
     * @param {Element[]} population - A set of Element type elements that are now the population.
     * @param {number} percent - Percentage of children who will be the calculated  as a result of crosses.
     * @param {string[]} genes -An array of strings that represents all possible genes that may be part of a chromosome.
     * @return {Element[]} - It must return the children that are result from a crossing a population process.
     */
    this.randomOverNoValidCrossover = function (parents, population, percent, genes) { 
        var children = [];
        var auxPopulation = clonePopulation(population);
        var firstElement = Math.floor(parents.length * (100 - percent) / 100);

        function mating(element1, element2) {
            var childChromosome = [];
            var i = 0;
            // Half element1’s elements are inserted.
            while (i < element1.getChromosome().length / 2) {
                childChromosome[i] = element1.getChromosome()[i];
                i++;
            }
            // Half element2’s elements are inserted.
            while (i < element2.getChromosome().length) {
                childChromosome[i] = element2.getChromosome()[i];
                i++;
            }
            return childChromosome;
        }

        // Sort array
        auxPopulation.sort(function (a, b) {
            return b.getFitness() - a.getFitness();
        });

        for (var i = 0; i < firstElement; i++) {
            children[i] = cloneElement(auxPopulation[i]);
        }

        for (var i = firstElement; i < parents.length - 1; i++) {
            children[i] = new Element(i, mating(parents[i], parents[i + 1]), 0);
        }

        // The last child is the son of the last and the first element of @parents
        children[i] = new Element(i, mating(parents[parents.length - 1], parents[0]), 0);

        for (var i = 0; i<children.length; i++){
            if(!this.isValid(children[i])){
                children[i] = randomChild(children[i].getChromosome().length,genes);
            }
        }

        return children;
    }

    /**
     * @function Functions#mutation
     * @description It makes the process of mutation given a population. It selects elements based on the chosen percentage and mutate one of their genes.
     *
     * @param {Element[]} children - Set of ítems to be mutated
     * @param {number} percent - A value indicating the percentage of elements of @children that will suffer a mutation.
     * @param {string[]} genes -An array of strings that represents all possible genes that may be part of a chromosome.
     * @return {Element[]} - Returns a copy of @children’s elements after some of they (a percentage indicated by @percent) have mutated.
     */
    this.mutation = function (children, percent, genes) { 
        var mutatedChildren = [];
        mutatedChildren = clonePopulation(children);
        for (var i = 0; i < mutatedChildren.length; i++) {
            if (Math.random() < (percent / 100)) {
                // The position of gene to mutate is calculated
                var posMutation = Math.round(Math.random() * (mutatedChildren[i].getChromosome().length - 1));
                do {
                    // Ensures that the replacement gene is not the same as the current
                    var gen = genes[Math.round(Math.random() * (genes.length - 1))];
                } while (gen.localeCompare(mutatedChildren[i].getChromosome()[posMutation]) == 0);
                mutatedChildren[i].setGen(posMutation, gen);
            }
        }
        return mutatedChildren;
    }

    /**
     * @function Functions#evolution
     * @description Replace back the current population by @mutatedChildren.
     *
     * @param {Element[]} mutatedChildren - A set of elements having undergone the processes of genetic algorithm.
     * @return {Element[]} - Returns the population for the next generation, ie, a copy of @ mutatedChildren
     */
    this.evolution = function (mutatedChildren) {
        var nextPopulation = [];
        nextPopulation = clonePopulation(mutatedChildren);
        return nextPopulation;
    }

     /**
     * @function Functions#allValidsEvolution
     * @description Replace back the current population by each @mutatedChildren elements. If a element is not valid, the sorted parent in its position takes the place.
     *
     * @param {Element[]} mutatedChildren - A set of elements having undergone the processes of genetic algorithm.
     * @return {Element[]} - Returns the population for the next generation with no invalid elements.
     */
    this.allValidsEvolution = function(mutatedChildren) {
        var nextPopulation = [];
        sortedParents = clonePopulation(this.getParents());
        sortedParents.sort(function (a, b) {
            return a.getFitness() - b.getFitness();
        });
        nextPopulation = clonePopulation(sortedParents);

        for (var i = 0, j=0; i < mutatedChildren.length; i++) {
            if(this.isValid(mutatedChildren[i])){
                nextPopulation[j] = cloneElement(mutatedChildren[i]);
                j++;
            }
        }
        return nextPopulation;
    }

    /** Utils **/

     /**
     * @function Functions#randomChild
     * @description It returns a Element with a random chromosome.
     *
     * @param {Element} chromosomeSize - The size of the desire Element.
     * @param {string[]} genes - The list of possible genes to be used by the algorithm.
     * @return {Element} - A @element with a random
     */
    function randomChild(chromosomeSize,genes){
        var auxChromosome = [];
        var chromosomeSize = genes.length;
        var auxGenes = genes.slice();
        for (var j = 0; j < chromosomeSize; j++) {
            var rand = Math.floor(Math.random() * auxGenes.length);
            // Each element of the chromosome is a randomly chosen gene of genes list
            auxChromosome[j] = auxGenes[rand];
            // The element already introduced in the list of candidate genes is removed
            auxGenes.splice(rand, 1);
        }
        return new Element(1, auxChromosome.slice(), 0);
    }

    /**
     * @function Functions#cloneElement
     * @description It returns the copy of an item introduced as a parameter.
     *
     * @param {Element} element - An element of type Element.
     * @return {Element} - A copy of @element
     */
    function cloneElement(element) {
        var copy = new Element(element.getId(), element.getChromosome(), element.getFitness());
        copy.setProbability(element.getProbability());
        return copy;
    }

    /**
     * @function Functions#clonePopulation
     * @description Returns the copy of an introduced population.
     *
     * @param {Element[]} population - A set of elements having undergone the processes of genetic algorithm.
     * @return {Element[]} - A copy of @population.
     */
    function clonePopulation(population) {
        var copy = [];
        for (var i = 0; i < population.length; i++) {
            copy[i] = cloneElement(population[i]);
        }
        return copy;
    }

    /**
     * @function Functions#printPopulation
     * @description It returns a string to make possible write a population in a leigbly way.
     *
     * @param {Element[]} population - A set of elements  of type Element.
     * @return {Element[]} - A string that lists all the elements of @population legibly.
     */
    this.printPopulation = function (population) {
        var result = "";
        for (var i = 0; i < population.length; i++) {
            result += population[i].write() + "\n";
        }
        return result
    }

}

/**
 * @class It creates an instance of a genetic algorithm.
 *
 * @this {GeneticAlgorithm}
 * @configuration {JSON Object} - Configuration parameters and functions that will be used by the algorithm, defined as follows:
 *      {function} isValid - function that defines whether the structure of a chromosome is valid.
 *      {function} fitnessFunction - A function that returns the fitness value of an element.
 *      {function} initialization - A function that initializes the population creating new elements.
 *      {function} evaluation - A function that uses the fitness function to evaluate the performance of each element.
 *      {function} selection - A function that selects the elements to get reproduce in this generation.
 *      {function} crossover - A function that performes crosses between elements and returns the children.
 *      {function} mutation - A function that receives elements and performs mutations.
 *      {function} evolution - A function that receives elements and decides which form part of the next generation.
 *      {number} popSize - The size of the population.
 *      {number} chromosomeSize - The length of each chromosome.
 *      {string[]} genes - the list of possible genes to be used by the algorithm.
 *      {boolean} repeated - true if a chromosome can contain repeated elements.
 *      {number} percentMutation - percentage of elements in the next generation will be the result of crosses. 
 *      {number} percentCrossover - percentage of elements in the next generation will be the result of crosses.
 */

function GeneticAlgorithm(configuration) {
    /** @lends GeneticAlgorithm# */

    /****************************** Attributes ********************************/

    that = this;

    /**
     * Optional data information about the elements
     *
     * @private
     * @name GeneticAlgorithm#tabla
     * @type Object
     */
   
    this.tabla = configuration.tabla;

    /**
     * Current generation's elements
     *
     * @private
     * @name GeneticAlgorithm#population
     * @type Element[]
     */
    this.population = [];

    /**
     * The elements outcome of the selection process.
     *
     * @private
     * @name GeneticAlgorithm#parents
     * @type Element[]
     */
    this.parents = [];

    /**
     * The elements outcome of the crossover and mutation processes.
     *
     * @private
     * @name GeneticAlgorithm#children
     * @type Element[]
     */
    this.children = [];

    /**
     * The element with best fitness value of the current population.
     *
     * @private
     * @name GeneticAlgorithm#best
     * @type Element[]
     */
    this.best = Object;

    /**
     * Number of the curent generation.
     *
     * @private
     * @name GeneticAlgorithm#generation
     * @type number
     * @default = 0;
     */
    this.generation = 0;

    /*********************** Functions of the GA ************************/

    /**
     * @function GeneticAlgorithm#initialization
     * @description It creates a new population.
     *
     * @return {Element[]} - It returns created elements.
     */
    this.initialization = configuration.initialization;

    /**
     * @function GeneticAlgorithm#isValid
     * @description Scan a chromosome and decides whether it is valid or not.
     *
     * @return {boolean} - It must return true if a chromosome can contain repeated elements.
     */
    this.isValid = configuration.isValid;

    /**
     * @function GeneticAlgorithm#fitnessFunction
     * @description Given an element calculates and returns its fitness value
     *
     * @return {number} - It must resturn fitness value of a given element.
     */
    this.fitnessFunction = configuration.fitnessFunction;

    /**
     * @function GeneticAlgorithm#evaluate
     * @description Assign its fitness value to each element of the population using the fitness function.
     *
     * @return {Element[]} - It must returns a population with associated fitness values
     */
    this.evaluate = configuration.evaluation;

    /**
     * @function GeneticAlgorithm#selection
     * @description Use criteria to select elements which will be reproduced in the current generation given a population
     *
     * @return {Element[]} - It must return a population consisting of selected elements to reproduce.
     */
    this.selection = configuration.selection;

    /**
     * @function GeneticAlgorithm#crossover
     * @description Given a population makes the necessary crossing processes to generate the children of the current population.
     *
     * @return {Element[]} -It must return the children as result of a population’s crossing process.
     */
    this.crossover = configuration.crossover;

    /**
     * @function GeneticAlgorithm#mutation
     * @description It makes the process of mutation given a population.
     *
     * @return {Element[]} - It must return the elements of the population once the mutation process has been performed.
     */
    this.mutation = configuration.mutation;

    /**
     * @function GeneticAlgorithm#evolution
     * @description Replaces the current population for the next generation
     *
     * @return {Element[]} - It must return the population of the next generation
     */
    this.evolution = configuration.evolution;

    /**
     * @function GeneticAlgorithm#initialize
     * @description Creates a new population
     */
    this.initialize = function () {
        that.setPopulation(that.initialization(configuration.popSize, configuration.chromosomeSize, configuration.genes, configuration.repeated));
    }

    /**
     * @function GeneticAlgorithm#simulateGeneration
     * @description Simulate the process lived by a generation of the genetic algorithm.
     *   - A population is initialized
     *   - Its elements are evaluated with a fitness function
     *   - After obtaining the values of fitness, a selection function is processed to choose which elements will reproduce
     *   - It takes place the reproduction process.
     *   - It takes place the mutation process.
     *   - The best element of the population is calculated
     *   - The number of generation advances
     */
    this.simulateGeneration = function () {
        if (that.getPopulation().length == 0) {
            console.log("There aren’t elements in the population, it must be initialized first");
        } else {
            that.setPopulation(that.evaluate(that.getPopulation(),that.tabla)); // Uts elements are evaluated
            that.setParents(that.selection(that.getPopulation())); // The selection function is used to choose which elements will reproduce
            that.setChildren(that.crossover(that.getParents(), that.getPopulation(), configuration.percentCrossOver,configuration.genes)); // Children are created as a result of crossing.
            that.setPopulation(that.getChildren()); // The children makes now the new population.
            that.setPopulation(that.mutation(that.getPopulation(), configuration.percentMutation, configuration.genes)); // It takes places mutation.
            that.setPopulation(that.evolution(that.getPopulation())); // The elements of population change with those obtained during the algorithm
            that.setPopulation(that.evaluate(that.getPopulation(),that.tabla)); // The new elements are evaluated
            that.setGeneration(that.getGeneration() + 1); // Increase the number of generation
            that.setBest((that.bestElement(that.getPopulation()))); // the best element of the generation is established
        }
    }

    /**
     * @function GeneticAlgorithm#simulateConditionalGeneration
     * @description Simulates generations of the genetic algorithm, up to the limit generation
     *
     * @param {number} finalGeneration - Number of generations to simulate.
     * 
     * @return {Element} -The best element in the time to reach the termination condition.
     */
    this.simulateConditionalGeneration = function (finalGeneration) {
        while (that.getGeneration() < finalGeneration) {
            that.simulateGeneration();
        }
        return that.getBest();
    }


    /**
     * @function GeneticAlgorithm#simulateConditionionalTime
     * @description Simulates generations of the genetic algorithm, up to the limit time.
     *
     * @param {number} finalTime - Time in ms. No more simulations will start after this time has been reached.
     * @return {Element} - The best element in the time to reach the termination condition.
     */
    this.simulateConditionalTime = function (finalTime) {
        var startT = new Date().getTime();
        var finalT = new Date().getTime();
        var tiempoSimulacion = 0;
        while (tiempoSimulacion < finalTime) {
            that.simulateGeneration();
            finalT = new Date().getTime();
            tiempoSimulacion = finalT - startT;
        }
        return that.getBest();
    }

    /**
     * @function GeneticAlgorithm#simulateConditionionalFitness
     * @descriptionSimulates generations the genetic algorithm until the best element of the generation reaches the desired value of fitness
     *
     * @param {number} finalFitness - Value of fitness you want to achieve the best element of a generation.
     * @return {Element} - The best element in the time to reach the termination condition.
     */
    this.simulateConditionalFitness = function (finalFitness) {
        that.simulateGeneration();
        while (that.getBest().getFitness() < finalFitness) {
            that.simulateGeneration();
        }
        return that.getBest();
    }

    /********************************* Utils *********************************/

    /**
     * @function GeneticAlgorithm#printPopulation
     * @description Returns a string with the current population in readable format for human being.
     *
     * @param {Element[]} population -Set of elements that form a population.
     * @return {string} - It Returns elements of @population in a readable string with their characteristics.
     */

    this.printPopulation = function (population) {
        var result = "";
        for (var i = 0; i < population.length; i++) {
            result += population[i].write() + "\n";
        }
        return result;
    }

    /**
     * @function GeneticAlgorithm#bestElement
     * @description Returns the best element of a population.
     *
     * @param {Element[]} populationWithFitness -  A population in which each element has assigned the value of fitness.
     * @return {Element} - Returns the element of populationWithFitness with best fitness.
     */
    this.bestElement = function (populationWithFitness) {
        var best = Object;
        var auxPopulation = [];

        // The first valid element is searched
        function firstValid(population) {
            var first = Object;
            var oneValid = false;
            for (var i = 0; i < population.length; i++) {
                if (that.isValid(population[i])) {
                    oneValid = true;
                    first = that.cloneElement(population[i]);
                    break;
                }
            }
            if (!oneValid) {
               console.log("There is no valid element in this generation");
            }
            return first;
        }
        auxPopulation = this.clonePopulation(populationWithFitness);
        auxPopulation = this.evaluate(auxPopulation,that.tabla);
        // When you start looking, the best element is the first element found valid
        best = this.cloneElement(firstValid(auxPopulation));
        // The population is covered, looking for the best element
        for (var i = 0; i < auxPopulation.length; i++) {
            if (this.isValid(auxPopulation[i]) && auxPopulation[i].getFitness() > best.getFitness()) {
                best = this.cloneElement(auxPopulation[i]);
            }
        }
        return best;
    }

    /**
     * @function GeneticAlgorithm#cloneElement.
     * @description It clones an element and returns its copy.
     *
     * @param {Element} element - A instance of type Element, that is, an element of the population.
     * @return {Element} The instance of @element copied.
     */
    this.cloneElement = function (element) {
        var copy = new Element(element.getId(), element.getChromosome(), element.getFitness());
        copy.setProbability(element.getProbability());
        return copy;
    }

    /**
     * @function GeneticAlgorithm#clonePopulation.
     * @description It clones a popuplation and returns copy
     *
     * @param {Element[]} population - A population of elements of type Element.
     * @return {Element[]} The copy of instances of each element of @population.
     */
    this.clonePopulation = function (population) {
        var copy = [];
        for (var i = 0; i < population.length; i++) {
            copy[i] = this.cloneElement(population[i]);
        }
        return copy;
    }

    /**
     * @function GeneticAlgorithm#fitnessMean
     * @description It computes and returns the average fitness of a population.
     *
     * @param {Element[]} population - A population of elements of type Element.
     * @return {number} - The average fitness value of the @population elements.
     */
    this.fitnessMean = function (population) {
        var mean = 0;
        for (var i = 0; i < population.length; i++) {
            mean += population[i].getFitness();
        }
        mean = mean / population.length;
        return mean;
    }


    /*************************** Getters & Setters **************************/

    /**
     * @function GeneticAlgorithm#getPopulation
     *
     * @return {Element[]} It returns a copy of the current population.
     */
    this.getPopulation = function () {
        var populationCopy = this.clonePopulation(this.population);
        return populationCopy;
    }

    /**
     * @function GeneticAlgorithm#getParents
     *
     * @return {Element[]} It returns a copy of the current parents.
     */
    this.getParents = function () {
        var parentsCopy = this.clonePopulation(this.parents);
        return parentsCopy;
    }

    /**
     * @function GeneticAlgorithm#getChildren
     *
     * @return {Element[]} It returns a copy of the current children.
     */
    this.getChildren = function () {
        var childrenCopy = this.clonePopulation(this.children);
        return childrenCopy;
    }

    /**
     * @function GeneticAlgorithm#getBest
     *
     * @return {Element} It returns a copy of the current best element.
     */
    this.getBest = function () {
        var bestCopy = this.cloneElement(this.best);
        return bestCopy;
    }

    /**
     * @function GeneticAlgorithm#getGeneration
     *
     * @return {number} It returns the current generation
     */
    this.getGeneration = function () {
        return this.generation;
    }

    /**
     * @function GeneticAlgorithm#setPopulation
     * @description It makes a copy of the population introduced as a parameter and sets it as current popuplation.
     *
     * @param {Element[]} population - A population of elements.
     */
    this.setPopulation = function (population) {
        var populationCopy = this.clonePopulation(population);
        this.population = populationCopy;
    }

    /**
     * @function GeneticAlgorithm#setParents
     * @description It makes a copy of the population introduced as a parameter and sets it as current parents.
     *
     * @param {Element[]} parents - A population of elements
     */
    this.setParents = function (parents) {
        var parentsCopy = this.clonePopulation(parents);
        this.parents = parentsCopy;
    }

    /**
     * @function GeneticAlgorithm#setChildren
     * @description It makes a copy of the population introduced as a parameter and sets it as current children.
     *
     * @param {Element[]} children - Una poblacion de elementos.
     */
    this.setChildren = function (children) {
        var childrenCopy = this.clonePopulation(children);
        this.children = childrenCopy;
    }

    /**
     * @function GeneticAlgorithm#setBest
     * @description It makes a copy of the element introduced as a parameter and sets it as current best element.
     *
     * @param {Element} best -A population of elements.
     */
    this.setBest = function (best) {
        var bestCopy = this.cloneElement(best);
        this.best = bestCopy;
    }

    /**
     * @function GeneticAlgorithm#setGeneration
     * @description Set the value of the current generation.
     *
     * @param {number} generation - A numerical value that represents the number of generation.
     */
    this.setGeneration = function (generation) {
        this.generation = generation;
    }
}