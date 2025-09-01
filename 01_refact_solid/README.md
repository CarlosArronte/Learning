# Refactoring

## Methods List:
[Extract function](#1--extract-function)  
[Replace Temp With Query](#2--replace-temp-with-query)  
[Inline Variable](#3--inline-variable)


**Pasos:** <br>
1. Garantizar un número **robusto** de testes a usar en la seccion de código a refactorar.<br>
    a) Esto será útil para la identificacion de errores introducidos en la refact.<br>
    b) SIEMPRE testes automáticos.


**Procedimientos**
-
## 1- Extract Function:<br>
**Cuando usar**:  
- Cuando se quiere separar **intencion** de **implementacion**.   
- Si es difícil averiguar lo que hace un segmento de código.  
- Separar segmentos de funciones largas (>6 lineas...).  

**Como usar**:  
- Crear una funcion y ponerle el nombre de **lo que hace** (no de como lo hace).  
- Si no consigo pensar en un buen nombre para ponerle a la funcion probablemente es senal de que no debería extraer la funcion.  
- Usar funciones anidadas si el lenguaje lo permite:  

```javascript
// Función externa
function procesarLista(lista) {
    // Función interna anidada
    function esPar(n) {
        return n % 2 === 0;
    }

    // Usamos la función interna para filtrar
    return lista.filter(esPar);
}

// Lista de ejemplo
const numeros = [1, 2, 3, 4, 5, 6];

// Llamada a la función
console.log(procesarLista(numeros)); // Output: [2, 4, 6] 
```
- Después de creada la función revisar la declaración de variables y parámetros (las variables en el marco de la func original pasan como parámetros de la func extraida. Si una variable está solo en el marco de la extraída, no pasar como parámetro).
- Evitar que las variables locales a la funcion original tomen valores en la función extraida. Por ejemplo:  
```javascript
function calcularEstatisticas(numeros) {
    let soma = 0;
    let contadorPar = 0;
    let contadorImpar = 0;

    for (let n of numeros) {
        soma += n;
        if (n % 2 === 0) contadorPar++;
        else contadorImpar++;
    }

    let media = soma / numeros.length;
    let proporcaoPar = contadorPar / numeros.length;
    let proporcaoImpar = contadorImpar / numeros.length;

    return { media, proporcaoPar, proporcaoImpar };
}
```
Si aquí intento extraer un método para calcular los contadores tendría que pasarle ```contadorPar```,```contadorImpar```,```soma``` y ```numeros``` lo que complejizaría demasiado la lógica haciendo el código aún más confuso. En este tipo de casos se usa otra Refact como [Split Variable](#2--esplit-variable).

**Qué hacer después:**
- Testear y corregir errores (esto se hace después de cada pequena refact: NO hacer una gran refact y después los testes!).
- Commit con el cambio.

## 2-Replace Temp With Query:<br>
**Cuando usar**:
- Cuando necesito usar una variable temporal para guardar el resultado de una expresión.
- Cuando la variable temporal es usada en multiples lugares.
- Cuando la variable temporal es usada en una expresión compleja.
- Cuando la variable temporal es usada en una expresión que no es obvia.
**Como usar**:
- La logica usada para calcular el valor de la variable debe arrojar el mismo resultado en cada llamada.
- Crear una función que devuelva el valor de la expresión.
- Reemplazar todas las referencias a la variable temporal por llamadas a la función.
- De ser posible, asignar una variable constante al resultado de la función.
**Qué hacer después**:
- Testear y corregir errores.
- Commit con el cambio.
**Ejemplo**:
```javascript
function getPrice() {
const basePrice = this._quantity * this._item.price;
var discountFactor = 0.98;
if (basePrice > 1000) discountFactor -= 0.03;
return basePrice * discountFactor;
}
```
Se refactoriza primeramente a:
```javascript
function getPrice() {
// const basePrice = this._quantity * this._item.price;
var discountFactor = 0.98;
if (this.getBasePrice() > 1000) discountFactor -= 0.03;
return this.getBasePrice() * discountFactor;
}

function getBasePrice() {
    return this._quantity * this._item.price;
}
```
Y luego a:
```javascript
function getPrice() {
// const basePrice = this._quantity * this._item.price;
// var discountFactor = 0.98;
// if (this.getBasePrice() > 1000) discountFactor -= 0.03;
// return this.getBasePrice() * discountFactor;
return this.getBasePrice() * this.getDiscountFactor();
}

function getBasePrice() {
    return this._quantity * this._item.price;
}

function getDiscountFactor(){
    var discountFactor = 0.98;
    if (this.getBasePrice() > 1000) discountFactor -= 0.03;
    return discountFactor;
}

```
## 3- Inline Variable:<br>
**Cuando usar**:
- Cuando una variable es asignada un valor que no cambia.
- Cuando una variable es asignada un valor que no es obvio.
- Cuando una variable es asignada un valor que es usado solo una vez.
**Como usar**:
- Reemplazar todas las referencias a la variable por la expresión que le asigna el valor.
- Eliminar la declaración de la variable.
**Qué hacer después**:
- Testear y corregir errores.
- Commit con el cambio.
**Ejemplo**:
```javascript
function getRating(driver) {
    const a = moreThanFiveLateDeliveries(driver);
    const b = isTerrible(driver);
    if (a || b) return 2;
    return 1;
}
function moreThanFiveLateDeliveries(driver) {
    return driver.numberOfLateDeliveries > 5;
}
function isTerrible(driver) {
    return driver.rating === 2;
}
```
Se refactoriza a:
```javascript
function getRating(driver) {
    if (moreThanFiveLateDeliveries(driver) || isTerrible(driver)) return 2;
    return 1;
}
function moreThanFiveLateDeliveries(driver) {
    return driver.numberOfLateDeliveries > 5;
}
function isTerrible(driver) {
    return driver.rating === 2;
}
```