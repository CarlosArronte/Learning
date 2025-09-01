# Refactoring

## Methods List:
[Extract function](#1--extract-function)


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