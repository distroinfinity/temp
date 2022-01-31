export function ValidateNewTradeTemplateInput(val) {
  // input is separated by space
  const inputs = val.split(" ");

  if (val.length === 0 || inputs.length === 0 || inputs[0] === "") {
    return "Enter Option: BTO/STO followed by a space";
  }

  if (inputs.length === 1) {
    return "next: enter space";
  }

  if (inputs[0].toUpperCase() !== "BTO" && inputs[0].toUpperCase() !== "STO") {
    return "Incorrect Option. Please use BTO/STO";
  }

  if(inputs.length === 2) {
    if(inputs[1] === "") {
      return "Enter Symbol i.e AMZN followed by space";
    }
    return "next: enter space";
  }

  if (/[\W|\d]/.test(inputs[1])) {
    return "Please enter a valid symbol, it should not contain numbers or special characters.";
  }

  // validate only last word, return either error msg or guide msg
  var last = inputs[inputs.length - 1];
  var secondLast = inputs[inputs.length -2];
  var err = '';

  if (last !== "") { // if last word is not " " (space)
    if (inputs.length >= 6) {// completed
    } else {
      return "next: enter space";
    }
  } else if (last === "") { // AMZN => ["AMZN", ""] already space entered
    if (inputs.length === 3) {
      return "Enter Option for example 500C for 500 Call or 500P for 500 Put.";
    }
    err = validateNewLastWorld(inputs[inputs.length-2]);
    if (err !== "") {
      return err;
    }
  }

  err = isValidNewTrades(inputs.slice(2));
  if(err !== "") return err;

  if(secondLast.startsWith("@")){
    if(secondLast.length > 1)
      err = checkDecimalNumber(secondLast.slice(1));
    else
      return "No price entered";
  }
  if(last.includes("Q")){
    if(last.length > 1)
      err = checkDecimalNumber(last.slice(1));
    else
      return "No quantity entered";
  }
  else{
    return "Remove extra spaces";
  }

  return "";
}

export function ValidateTradeTemplateInput(val) {
  // input is separated by space
  const inputs = val.split(" ");
  //console.log(inputs);
  // no input entered yet
  if (val.length === 0 || inputs.length === 0 || inputs[0] === "") {
    return "Enter Symbol i.e AMZN followed by space";
  }

  if (inputs.length === 1) {
    return "next: enter space";
  }

  // validate only last word, return either error msg or guide msg
  var last = inputs[inputs.length - 1];
  var err = '';

  if (last !== "") { // if last word is not " " (space)
    if (inputs.length >= 5 && inputs[inputs.length-2].includes('Q')) {// completed
      
    } else {
      return "next: enter space";
    }
    // input is complete and correct
  } else if (last === "") { // AMZN => ["AMZN", ""] already space entered
    // if only symbol and space is entered.
    if (inputs.length === 2) {
      return "Please enter strike date in either mm/dd or mm/dd/yy format.";
    }
    err = validateLastWorld(inputs[inputs.length - 2]);
    if (err !== "") {
      return err;
    }
  }

  if (/[\W|\d]/.test(inputs[0])) {
    return "Please enter a valid symbol, it should not contain numbers or special characters.";
  }

  return isValidTrades(inputs.slice(1));
}

function validateNewLastWorld(lastWord) {
  if (lastWord.includes("P") || lastWord.includes("C")) {
    return "Please enter strike date in either mm/dd or mm/dd/yy format.";
  }
  else if (lastWord.includes("/")) { // if last word is date
    var err = isValidDate(lastWord);
    if (err !== "") return err;
    return "Enter another Option for previous expiry date or start another option else enter enter total price per contract (like @5 or @-5)";
  }
  else if (lastWord.includes("@")) {
    var err1 = checkDecimalNumber(lastWord.slice(1));
    if (err1 !== "") return err1;
    return "Enter Quantity in the following format Q{quantity} for example Q10 for 10 quantity."
  }
  return "";
}

function validateLastWorld(lastWord) {
  if (lastWord.includes("/")) { // if last word is date
    var err = isValidDate(lastWord);
    if (err !== "") return err;
    return "Enter Option for last expiry date for example B500C for Buy 500 Call or S500C for sell 500 call.";
  } else if (lastWord.includes("B") || lastWord.includes("C")) {
    return "Enter another Option for previous expiry date or start another strike date or quantity. Quantity can be enter in following format Q{quantity} for example Q10 for 10 quantity.";
  } else if (lastWord.includes("Q")) {
    return "Enter enter total price per contract (like @5 or @-5)";
  }
  return "";
}

function isValidNewTrades(inputs) {
  var err = "";
  err = isValidNewOption(inputs[0]);
  if(err !== "") return err;

  if(inputs.length > 1) {
    if(inputs[1].includes("P") || inputs[1].includes("C")) {
      return isValidNewTrades(inputs.slice(1));
    }
    else {
      if(inputs[1] === "")
        err = validateNewLastWorld(inputs[1]);
      if(err !== "") {
        return err;
      }
      err = isValidDate(inputs[1]);
      if (err !== "") return err;
    }
  }

  if(inputs.length > 2) {
    if(inputs[2].includes("@")){
      return "";
    }
    else {
      err = isValidNewTrades(inputs.slice(2));
      if(err !== "") {
        return err;
      }
    }
  }

  return "";
}

function isValidTrades(inputs) {
  var err = isValidDate(inputs[0]);
  if (err !== "") return err;
  if (inputs.length < 2) {
    return "Please enter Option.";
  }
  err = isValidOption(inputs[1]); // atleast one option for a expiry date.
  if (err !== "") return err;

  for (var i = 2; i < inputs.length; i++) {
    if (inputs[i].includes("B") || inputs[i].includes("S")) {
      err = isValidOption(inputs[i]);
      if (err !== "") return err;
    } else if (inputs[i].includes("/")) {
      return isValidTrades(inputs.slice(i));
    } else {
      err = checkQuantity(inputs[i]);
      if (err !== "") {
        return err;
      }
      if (i + 1 === inputs.length - 1) {
        return checkDecimalNumber(inputs[i + 1]);
      } else {
        return (
          "Input should end with price per contract, Please remove " +
          inputs[i + 2]
        );
      }
    }
  }

  return "";
}

function isValidNewOption(val) {
  var options = val.split("/");
  if(options.lenght === 0){
    //do nothing, return error from the last return statement
  }
  else {
    if(options.length > 1){
      for(var i=0;i<options.length-1;i++)
      {
        if (/^\d*(\.\d+)?$/.test(options[i])){
          //do nothing
        }
        else {
          return (
            val +
            " is incorrect Option, Please enter option in following format {[StrikePrice]/}*[StrikePrice][P/C] for example 600P for Put at 600 strike."
          );
        }
      }
      if (/^\d*(\.\d+)?(P|C)$/.test(options[options.length-1]))
        return "";
    }
    else if (/^\d*(\.\d+)?(P|C)$/.test(options[0])) 
        return "";
  }

  return (
    val +
    " is incorrect Option, Please enter option in following format {[StrikePrice]/}*[StrikePrice][P/C] for example 600P for Put at 600 strike."
  );
}

function isValidOption(val) {
  if (/^(B|S)\d*(\.\d+)?(P|C)$/.test(val)) {
    return "";
  }
  return (
    val +
    " is incorrect Option, Please enter option in following format [B/S][StrikePrice][P/C] for example B500C for Buy Call at 500 strike, S500C for Sell Call at 500 strike, B600P for Buy Put at 600 strike."
  );
}

function checkQuantity(val) {
  var err =
    val +
    " quantity is incorrect, Please enter a valid quntity for example Q10 for 10 contracts.";
  if (!val) return err;
  if (val[0].includes("Q") === false) return err;
  if (/^\d+$/.test(val.slice(1))) return "";
  return err;
}
function checkDecimalNumber(val) {
  if (/^(-)?\d*(\.\d+)?$/.test(val)) return "";
  return (
    val +
    " amount is incorrect, Please enter a valid amount for example 0.65 or 5.00"
  );
}

function isValidDate(date) {
  var mmdd = /^(0[1-9]|1[012])(\/)(0[1-9]|[12][0-9]|3[01])$/.test(date);
  var mmddyy = /^(0[1-9]|1[012])(\/)(0[1-9]|[12][0-9]|3[01])(\/)([2-9][0-9])$/.test(date);
  if (!(mmdd || mmddyy)) {
    return (
      "Strike date " +
      date +
      " is incorrect. Please enter valid expiry date in either mm/dd or mm/dd/yy format"
    );
  }
  return "";
}
