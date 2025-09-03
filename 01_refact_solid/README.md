# Refactoring

## Methods List:
[Extract function](#1--extract-function)  
[Replace Temp With Query](#2--replace-temp-with-query)  
[Inline Variable](#3--inline-variable)
[Split Loop](#4--split-loop)  
[Slide Statement](#5--slide-statement)  
[Split Phase](#6--split-phase) 
[Move Function](#7--move-function)
[Replace Loop With Pipeline](#8--replace-loop-with-pipeline)
[Replace Conditional With Polymorphism](#9--replace-conditional-with-polymorphism)
[Change Function Declaration](#10--change-function-declaration)



**Pasos:** <br>
1. Garantizar un número **robusto** de testes a usar en la seccion de código a refactorar.<br>
    a) Esto será útil para la identificacion de errores introducidos en la refact.<br>
    b) SIEMPRE testes automáticos.
2. Split Loop (si es necesario).<br>
3. Slide Statement (si es necesario).<br>
4. Extract Function.<br>
5. Replace Temp With Query (si es necesario).<br>
6. Inline Variable (si es necesario).<br>



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
## 4- Split Loop:<br>
**Cuando usar**:
- Cuando un loop hace más de una cosa.
**Como usar**:
- Dividir el loop en dos o más loops, cada uno haciendo una sola cosa.
**Qué hacer después**:
- Extraer funciones para cada loop si es necesario.
- Testear y corregir errores.
- Commit con el cambio.
**Ejemplo**:
```javascript
function getTotal(students) {
    let price = 0;
    let amount = 0;

for(const s of students) {
        price += s.price;
        amount += s.amount;
    }
    return price * amount;
}
```
Se refactoriza a:
```javascript

function getPrice(students) {
    let price = 0;
    for(const s of students) {
        price += s.price;
    }
    return price;
}

function getAmount(students) {
    let amount = 0;
    for(const s of students) {
        amount += s.amount;
    }
    return amount;
}

function getTotal(students) {    
    return getPrice(students) * getAmount(students);
}
```
## 5- Slide Statement:<br>
**Cuando usar**:
- Cuando una sentencia puede ser movida a otro lugar sin afectar la lógica del código.
- Cuando una sentencia está en un lugar que dificulta la comprensión del código.
- Se usa basicamente para mejorar la legibilidad del código.
**Como usar**:
- Mover la sentencia a un lugar más apropiado, como dentro de un bloque condicional o fuera de un loop.
**Qué hacer después**:
- Testear y corregir errores.
- Commit con el cambio.
**Ejemplo**:
```javascript
let result;
if (availableResources.length === 0) {
result = createResource();
allocatedResources.push(result);
} else {
result = availableResources.pop();
allocatedResources.push(result);
}
return result;
```
Se refactoriza a:
```javascript
let result;
if (availableResources.length === 0) {
result = createResource();
} else {
result = availableResources.pop();
}
allocatedResources.push(result);
return result;

```

## 6- Split Phase:<br>
**Cuando usar**:
- Cuando una función realiza múltiples fases de procesamiento que pueden ser separadas.
- Cuando cada fase tiene una responsabilidad distinta y clara.
- Tener en cuenta que cada fase usa sus propios datos intermedios (lo que usa una fase no debería ser usado por otra).
- La idea es usar una estructura que encapsule los datos intermedios y pase esa estructura entre las fases.
**Como usar**:
- Dividir la función en varias funciones, cada una encargada de una fase específica del procesamiento.
- Asegurarse de que cada función tenga un nombre descriptivo que refleje su propósito.
**Qué hacer después**:
- Testear y corregir errores.
- Commit con el cambio.
**Ejemplo**:
```javascript
 function priceOrder(product, quantity, shippingMethod) {
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0)* product.basePrice * product.discountRate;
    const shippingPerCase = (basePrice > shippingMethod.discountThreshold)? shippingMethod.discountedFee : shippingMethod.feePerCase;
    const shippingCost = quantity * shippingPerCase;
    const price = basePrice - discount + shippingCost;
    return price;
 }
```
Se refactoriza a:
```javascript
 function priceOrder(product, quantity, shippingMethod) {
    const priceData = getPriceData(product, quantity);
    return applyShipping(priceData,shippingMethod);
 }

function getPriceData(product, quantity){
    const basePrice = product.basePrice * quantity;
    const discount = Math.max(quantity - product.discountThreshold, 0)* product.basePrice * product.discountRate;
    return {basePrice:basePrice,quantity:quantity,discount:discount};
}

function applyShipping(priceData,shippingMethod){
    const shippingPerCase = (priceData.basePrice > shippingMethod.discountThreshold)? shippingMethod.discountedFee : shippingMethod.feePerCase;
    const shippingCost = priceData.quantity * shippingPerCase;
    return priceData.basePrice - priceData.discount + shippingCost;
    
}

```

## 7- Move Function:<br>
**Cuando usar**:
- Cuando una función está más relacionada con otra clase o módulo que con la clase o módulo en el que está actualmente.
- Cuando una función utiliza principalmente datos de otra clase o módulo.
- Cuando una función no utiliza datos de la clase o módulo en el que está actualmente.
- Regla general: Si es dificil decidir dónde mover la función, probablemente no debería moverse.
**Como usar**:
- Identificar la clase o módulo al que la función está más relacionada.
- Mover la función a esa clase o módulo.
- Actualizar todas las referencias a la función para que apunten a su nueva ubicación.
**Qué hacer después**:
- Testear y corregir errores.
- Commit con el cambio.
**Ejemplo**:
```php
class Order {
    private $amount;
    private $customer;

    public function __construct(float $amount, Customer $customer) {
        $this->amount = $amount;
        $this->customer = $customer;
    }

    // Función que calcula el descuento (no debería estar aquí ya que usa datos de Customer)
    public function calculateDiscount(): float {
        $discount = 0;
        if ($this->customer->isLoyal()) {
            $discount = $this->amount * 0.1; // 10% descuento para clientes leales
        }
        return $discount;
    }

    public function getFinalAmount(): float {
        return $this->amount - $this->calculateDiscount();
    }
}

class Customer {
    private $isLoyal;

    public function __construct(bool $isLoyal) {
        $this->isLoyal = $isLoyal;
    }

    public function isLoyal(): bool {
        return $this->isLoyal;
    }
}
```
Se refactoriza a:
```php
class Order {
    private $amount;
    private $customer;

    public function __construct(float $amount, Customer $customer) {
        $this->amount = $amount;
        $this->customer = $customer;
    }

    public function getFinalAmount(): float {
        return $this->amount - $this->customer->calculateDiscount($this->amount);
    }
}

class Customer {
    private $isLoyal;

    public function __construct(bool $isLoyal) {
        $this->isLoyal = $isLoyal;
    }

    public function isLoyal(): bool {
        return $this->isLoyal;
    }

    // Función trasladada a la clase Customer
    public function calculateDiscount(float $amount): float {
        $discount = 0;
        if ($this->isLoyal) {
            $discount = $amount * 0.1; // 10% descuento para clientes leales
        }
        return $discount;
    }
}
```

## 8- Replace Loop With Pipeline:<br>
**Cuando usar**:
- Cuando un loop puede ser reemplazado por una serie de operaciones de transformación y filtrado.
- Cuando el loop realiza operaciones que pueden ser expresadas de manera más concisa y legible usando funciones de orden superior como map, filter, reduce, etc (la idea es sustituir el loop con operaciones de mapeado y filtrado).
**Como usar**:  
- Identificar el loop que se desea reemplazar.
- Determinar las operaciones de transformación y filtrado que el loop realiza.
- Reemplazar el loop con una cadena de llamadas a funciones de orden superior que realicen las mismas operaciones.
**Qué hacer después**:
- Testear y corregir errores.
- Commit con el cambio.
**Ejemplo**:
```javascript
function getActiveUserNames(users) {
    const activeUserNames = [];
    for (const user of users) {
        if (user.isActive) {
            activeUserNames.push(user.name);
        }
    }
    return activeUserNames;
}
```
Se refactoriza a:
```javascript
function getActiveUserNames(users) {
    return users
        .filter(user => user.isActive) // Filtrar usuarios activos
        .map(user => user.name);       // Mapear a nombres de usuario
}
```
## 9- Replace Conditional With Polymorphism:<br>
**Cuando usar**:
- Cuando una estructura condicional (if, switch) determina el comportamiento de un objeto basado en su tipo o estado.
- Cuando se tiene una jerarquía de clases y cada subclase implementa un comportamiento diferente.
**Como usar**:
- Identificar la estructura condicional que se desea reemplazar.
- Crear una clase base con un método abstracto o virtual que represente el comportamiento común.
- Crear subclases que implementen el método de manera específica para cada caso.
- Reemplazar la estructura condicional con llamadas al método polimórfico.
**Qué hacer después**:
- Testear y corregir errores.
- Commit con el cambio.
**Ejemplo**:
```javascript
class Employee {
    constructor(name, type) {
        this.name = name;
        this.type = type; // 'full-time', 'part-time', 'contractor'
    }

    calculatePay(hoursWorked) {
        if (this.type === 'full-time') {
            return hoursWorked * 30; // tarifa por hora para full-time
        } else if (this.type === 'part-time') {
            return hoursWorked * 20; // tarifa por hora para part-time
        } else if (this.type === 'contractor') {
            return hoursWorked * 40; // tarifa por hora para contractor
        }
        throw new Error('Unknown employee type');
    }
}
```
Se refactoriza a:
```javascript
class Employee {
    constructor(name) {
        this.name = name;
    }

    calculatePay(hoursWorked) {
        throw new Error('This method should be overridden!');
    }
}
class FullTimeEmployee extends Employee {
    calculatePay(hoursWorked) {
        return hoursWorked * 30; // tarifa por hora para full-time
    }
}
class PartTimeEmployee extends Employee {
    calculatePay(hoursWorked) {
        return hoursWorked * 20; // tarifa por hora para part-time
    }
}
class Contractor extends Employee {
    calculatePay(hoursWorked) {
        return hoursWorked * 40; // tarifa por hora para contractor
    }
}
```
## 10- Change Function Declaration:<br>