function takePage(fullList, page, pageSize){
  let offset = pageSize * page;
  return fullList.slice(offset, offset+pageSize);
}

function calcPageCount(totalRows, pageSize){
  if (totalRows == 0) {
    return 0;
  } else if (totalRows % pageSize == 0) {
    return totalRows / pageSize;
  } else {
    return Math.floor(totalRows / pageSize)+1;
  }
}

export {
  takePage,
  calcPageCount,
}
