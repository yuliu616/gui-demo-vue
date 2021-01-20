function formatString() {
  var theString;
  var argCount;
  var paramList;
  if (Array.isArray(arguments[0])) {
    paramList = arguments[0];
    argCount = arguments[0].length;
    theString = arguments[0][0];
  } else {
    paramList = arguments;
    argCount = arguments.length;
    theString = arguments[0];
  }
  
  // start with the second argument (i = 1)
  for (var i = 1; i < argCount; i++) {
      // "gm" = RegEx options for Global search (more than one instance)
      // and for Multiline search
      var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
      theString = theString.replace(regEx, paramList[i]);
  }
  
  return theString;
}

export {
  formatString,
}
