/**
 * semantic-ui dropdown component will broken after the 
 * dom is managed/replaced by router or vue logic,
 * as a work-around/fix, we need to correct it 
 * by calling this method.
 */
function fixSemanticUiDropdown(){
  setTimeout(()=>{
    window.$('.ui.dropdown').dropdown();
  });
}

export {
  fixSemanticUiDropdown,
}
