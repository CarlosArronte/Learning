/*
Primera intencion de refact con los nombres de las variables originales
*/
// function amountFor(perf, play) {
//     let thisAmount = 0;
//     switch (play.type) {
//         case "tragedy":
//             thisAmount = 40000;
//             if (perf.audience > 30) {
//                 thisAmount += 1000 * (perf.audience - 30);
//             }
//             break;
//         case "comedy":
//             thisAmount = 30000;
//             if (perf.audience > 20) {
//                 thisAmount += 10000 + 500 * (perf.audience - 20);
//             }
//             thisAmount += 300 * perf.audience;
//             break;
//         default:
//             throw new Error(`unknown type: ${play.type}`);
//     }
//     return thisAmount;
// }


/*
Cambio de nombre de las variables (se hace para que coincida el formato en el proyecto entero)
PE: Chamar sempre o valor de retorno de uma função de “result” faz parte do
meu padrão de programação.
*/

// function amountFor(perf, play) {
//     let result = 0;
//     switch (play.type) {
//         case "tragedy":
//             result = 40000;
//             if (perf.audience > 30) {
//                 result += 1000 * (perf.audience - 30);
//             }
//             break;
//         case "comedy":
//             result = 30000;
//             if (perf.audience > 20) {
//                 result += 10000 + 500 * (perf.audience - 20);
//             }
//             result += 300 * perf.audience;
//             break;
//         default:
//             throw new Error(`unknown type: ${play.type}`);
//     }
//     return result;
// }

/*
Otro cambio que podría hacer: perf = aPerformance (meu nome default para um parâmetro inclui
o nome do tipo. Uso um artigo indefinido para ele, a menos que haja alguma
informação específica sobre o seu papel que deva ser incluída no nome.
)
*/
// function amountFor(aPerformance, play) {
//     let result = 0;
//     switch (play.type) {
//         case "tragedy":
//             result = 40000;
//             if (aPerformance.audience > 30) {
//                 result += 1000 * (aPerformance.audience - 30);
//             }
//             break;
//         case "comedy":
//             result = 30000;
//             if (aPerformance.audience > 20) {
//                 result += 10000 + 500 * (aPerformance.audience - 20);
//             }
//             result += 300 * aPerformance.audience;
//             break;
//         default:
//             throw new Error(`unknown type: ${play.type}`);
//     }
//     return result;
// }




// function statement(invoice, plays) {
//     let totalAmount = 0;
//     let volumeCredits = 0;
//     let result = `Statement for ${invoice.customer}\n`;
//     const format = new Intl.NumberFormat("en-US",
//         {
//             style: "currency", currency: "USD",
//             minimumFractionDigits: 2
//         }).format;
//     for (let perf of invoice.performances) {
//         const play = plays[perf.playID];
//         let thisAmount = amountFor(perf, play);//Funcion extraida
//         // soma créditos por volume
//         volumeCredits += Math.max(perf.audience - 30, 0);
//         // soma um crédito extra para cada
//         // dez espectadores de comédia
//         if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
//         // exibe a linha para esta requisição
//         result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
//         totalAmount += thisAmount;
//     }
//     result += `Amount owed is ${format(totalAmount / 100)}\n`;
//     result += `You earned ${volumeCredits} credits\n`;
//     return result;
// }


/*
Ahora elimino la variabe play (siguiendo el principio de Replace Temp With Query)
*/
// function amountFor(aPerformance) {
//     let result = 0;
//     switch (playFor(aPerformance).type) {
//         case "tragedy":
//             result = 40000;
//             if (aPerformance.audience > 30) {
//                 result += 1000 * (aPerformance.audience - 30);
//             }
//             break;
//         case "comedy":
//             result = 30000;
//             if (aPerformance.audience > 20) {
//                 result += 10000 + 500 * (aPerformance.audience - 20);
//             }
//             result += 300 * aPerformance.audience;
//             break;
//         default:
//             throw new Error(`unknown type: ${playFor(aPerformance).type}`);
//     }
//     return result;
// }

// function playFor(aPerformance) {
//     return plays[aPerformance.playID];
// }


// function statement(invoice, plays) {
//     let totalAmount = 0;
//     let volumeCredits = 0;
//     let result = `Statement for ${invoice.customer}\n`;
//     const format = new Intl.NumberFormat("en-US",
//         {
//             style: "currency", currency: "USD",
//             minimumFractionDigits: 2
//         }).format;
//     for (let perf of invoice.performances) {
//         const play = plays[perf.playID];
//         let thisAmount = amountFor(perf);//Funcion extraida
//         // soma créditos por volume
//         volumeCredits += Math.max(perf.audience - 30, 0);
//         // soma um crédito extra para cada
//         // dez espectadores de comédia
//         if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
//         // exibe a linha para esta requisição
//         result += ` ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
//         totalAmount += thisAmount;
//     }
//     result += `Amount owed is ${format(totalAmount / 100)}\n`;
//     result += `You earned ${volumeCredits} credits\n`;
//     return result;
// }

/*
Ahora observo como thisAmount puede ser sustituida como amountFor(perf); en todo el codigo
*/

// function statement(invoice, plays) {
//     let totalAmount = 0;
//     let volumeCredits = 0;
//     let result = `Statement for ${invoice.customer}\n`;
//     const format = new Intl.NumberFormat("en-US",
//         {
//             style: "currency", currency: "USD",
//             minimumFractionDigits: 2
//         }).format;
//     for (let perf of invoice.performances) {//        
//         // soma créditos por volume
//         volumeCredits += Math.max(perf.audience - 30, 0);
//         // soma um crédito extra para cada
//         // dez espectadores de comédia
//         if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);
//         // exibe a linha para esta requisição
//         result += ` ${play.name}: ${format(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
//         totalAmount += amountFor(perf);
//     }
//     result += `Amount owed is ${format(totalAmount / 100)}\n`;
//     result += `You earned ${volumeCredits} credits\n`;
//     return result;
// }

/*
Sigo viendo que la funcion statement puede ser dividida en funciones aun menores (volumeCreditsFor(perf))
*/
// function playFor(aPerformance) {
//     return plays[aPerformance.playID];
// }

// function volumeCreditsFor(perf) {
//     let volumeCredits = 0;
//     volumeCredits += Math.max(perf.audience - 30, 0);
//     if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
//     return volumeCredits;
// }

// function statement(invoice, plays) {
//     let totalAmount = 0;
//     let volumeCredits = 0;
//     let result = `Statement for ${invoice.customer}\n`;
//     const format = new Intl.NumberFormat("en-US",
//         {
//             style: "currency", currency: "USD",
//             minimumFractionDigits: 2
//         }).format;
//     for (let perf of invoice.performances) {
//         volumeCredits += volumeCreditsFor(perf);
//         result += ` ${playFor(perf).name}:
// {format(amountFor(perf)/100)} (${perf.audience} seats)\n`;
//         totalAmount += amountFor(perf);
//     }
//     result += `Amount owed is ${format(totalAmount / 100)}\n`;
//     result += `You earned ${volumeCredits} credits\n`;
//     return result;
// }

/*
    Otra funcion útil a extraer es la asociada con la variable format
*/
// function usd(aNumber) {
//     return new Intl.NumberFormat("en-US",
//         {
//             style: "currency", currency: "USD",
//             minimumFractionDigits: 2
//         }).format(aNumber);
// }

// function playFor(aPerformance) {
//     return plays[aPerformance.playID];
// }

// function volumeCreditsFor(perf) {
//     let volumeCredits = 0;
//     volumeCredits += Math.max(perf.audience - 30, 0);
//     if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
//     return volumeCredits;
// }

// function statement(invoice, plays) {
//     let totalAmount = 0;
//     let volumeCredits = 0;
//     let result = `Statement for ${invoice.customer}\n`;

//     for (let perf of invoice.performances) {
//         volumeCredits += volumeCreditsFor(perf);
//         result += ` ${playFor(perf).name}: {usd(amountFor(perf)/100)} (${perf.audience} seats)\n`;
//         totalAmount += amountFor(perf);
//     }
//     result += `Amount owed is ${usd(totalAmount / 100)}\n`;
//     result += `You earned ${volumeCredits} credits\n`;
//     return result;
// }

/*
Ahora percibo que dentro del for que tengo hago más de 1 cosa por lo que debo usar Split Loop y luego podré extraer las func
*/

function usd(aNumber) {
    return new Intl.NumberFormat("en-US",
        {
            style: "currency", currency: "USD",
            minimumFractionDigits: 2
        }).format(aNumber);
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

function volumeCreditsFor(perf) {
    let volumeCredits = 0;
    volumeCredits += Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);
    return volumeCredits;
}

function getVolumeCredits(invoice) {
    let result = 0;
    for (let perf of invoice.performances) {
        result += volumeCreditsFor(perf);
    }

    return result;
}

function getTotalAmmount(invoice) {
    let result = 0;
    for (let perf of invoice.performances) {
        result += amountFor(perf);
    }
    return result;
}

function statement(invoice, plays) {

    let result = `Statement for ${invoice.customer}\n`;
    for (let perf of invoice.performances) {
        result += ` ${playFor(perf).name}: {usd(amountFor(perf)/100)} (${perf.audience} seats)\n`;
    }

    // let totalAmount = 0;
    // for (let perf of invoice.performances) {
    //     result += ` ${playFor(perf).name}: {usd(amountFor(perf)/100)} (${perf.audience} seats)\n`;
    //     totalAmount += amountFor(perf);
    // }

    /*getVolumeCredits(perf)*/
    // let volumeCredits = 0;
    // for (let perf of invoice.performances) {
    //     volumeCredits += volumeCreditsFor(perf);
    // }

    result += `Amount owed is ${usd(getTotalAmmount(invoice) / 100)}\n`;
    result += `You earned ${getVolumeCredits(invoice)} credits\n`;
    return result;
}