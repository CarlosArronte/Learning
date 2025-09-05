# SOLID

## S: Single Responsability Principle

Se basa en el principio de que cada clase debe tener UNA UNICA RESPONSABILIDAD!  

Ejemplo:
```php
class Panadero{
    public hornearPan(){
        echo "Horneando Pan";
    }
}

class Barrendero{
    public barrerPanaderia(){
        echo "Barriendo la panaderia";
    }
}

class Administrador{
    public administrarPanaderia(){
        echo "Administrando la panaderia"; 
    }
}
```

Seria incorrecto crear una sola clase que hiciera todas esas cosas a la vez.

## O: Open Closed Principle

Se basa en el principio de que las clases deben estar abiertas a extensiones pero cerradas a modificaciones (se deberia poder extender el comportamiento de una clase sin necesidad de modificar el codigo base). Esto es: las clases bases deben aguantar polimorfismo:

```php
abstract class ProcessPaymment{
    abstract public function pay();

    public function terminar(){
        echo "Pago Realizado";
    }
}

class CreditCardPaymment extends ProcessPaymment{
    public function pay(){
        echo "Pagando con carton de credito";
    }
}

class PayPalPaymment extends ProcessPaymment{
    public function pay(){
        echo "Pagando con PayPal";
    }
}


main(){
    $cc = new CreditCardPaymment;
    $cc->pay(); //Pagando con carton de credito
    $cc->terminar();//Pago Realizado

    $pp =new PayPalPaymment;
    $pp->pay();//Pagando con PayPal
}
```

## L: Liskov Substitution Principle

Se basa en el principio de que las clases derivadas pueden ser enteramente sustituibles por la clase padre.

Ejemplo

```php
class Animal{
    protected patas;

    public function __construct(patas){
        this->patas = patas;
    }

    abstract public function getPatas(){
        return this->patas;
    }
}


class Arana extends Animal{
    public function __construct(){
        this->patas = 8;
    }

    public getPatas(){
        return 8;
    }
}
```

En el ejemplo anterior, cualquier **Animal** puede ser una **Arana** si se hace **$animal = new Animal(8)**.

Una violacion de este principio seria intentar generalizar a un animal con la clase **Arana**.

## I: Interface Segregation Principle

Se basa en el principio  de **no forzar a un cliente de una interfaz a implememtar metodos de la interfaz que son irrelevantes a él**. O sea: es preferible tener muchas interfaces pequenas(cumpliendo con el principio de Single Responsability Principle) a tener una única interfaz que lo hace todo. Esto es: supón que eres hombre y vas a un hospital y te ofrecen todos los servicios (incluyendo obstetricia y ginecología). Otro: supón que eres vegano y vas a un restaurante donde te ofrecen un menú con todo tipo de comidas (cuando debieras tener solamente un menu vegano).

Ejemplo:
```php

interface iVeganMenu{
    public function getVeganItems();
}

interface iMeatMenu{
    public function getMeatItems();
}

interface iDrink{
    public function getDrinkItems();
}


//Una implementacion seria:
class VeganMenu implements iVeganMenu{
    public function getVeganItems(){
        return "Calabaza, Berenjena, Soja";
    }
}
```
Aqui hubiera estado mal haber creado una única interface **Menu** para implementar todos los métodos independientemente de quiénes la usen.
## D: Dependency Inversion Principle

Se basa en el principio de que los módulos de alto nivel no deben depender de los módulos de bajo nivel: AMBOS deben depender de interfaces o abstracciones.

Ejemplo de **violacion** de este principio:
```php
class Student{
    private $id;
    public function __construct(int $id){
        $this->id = $id;
    }

    public function getID(){
        return "El estudiante tiene el ID:".$this->id;
    }
}


class Logguer{
    private Student $student;

    //Dependencia directa de clase de bajo nivel
    public function ___constructor(Student $student){
        $this->student = $student;
    }

    public function log(){
        echo  "Guardando id:".$this->student->getID();
    }
}
```

En el ejemplo anterior si quisiera loguear a un profesor se me haria demasiado dificil ya que necesitaria modificar el código de Logguer para que funcione con otro tipo de usuarios (recordar el Open Closed Principle).  
La mejor solucion en este caso es esta:

```php
interface User{
    protected $id;

    public function getID();
}

class Student implements User{

    public function __constructor($id){
        $this->id = $id;
    }
    public function getID(){
        return "El estudiante tiene el ID:".$this->id;
    }
}

class Logguer{
    private User $user;

    //Dependencia de interfaz
    public function ___constructor(User $user){
        $this->user = $user;
    }

    public function log(){
        echo  "Guardando id:".$this->user->getID();
    }
}
```

En el caso anterior Logguer funcionará con cualquier tipo de usuario que implemente la clase User.   
Ejemplo para loguear un teacher:

```php
class Teacher implements User{

    public function __constructor($id){
        $this->id = $id;
    }
    public function getID(){
        return "El profesor tiene ID:" . $this->$id;
    }
}
```

Ahora se podrá hacer sin problemas:

```php
main(){
    Student $st = new Student(11);
    Teacher $tc = new Teacher(22);

    Logguer $l_st= new Logguer($st);
    Logguer $l_tc = new Logguer($tc);


    $l_st->log();//Guardando id: El estudiante tiene el ID: 11
    $l_tc->log();//Guardando id: l profesor tiene ID: 22
}
```