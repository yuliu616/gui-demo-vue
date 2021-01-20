function navigateToIfNeeded(router, targetPath){
  if (targetPath && targetPath != router.currentRoute.fullPath) {
    router.push(targetPath);
  }
}

/**
 * for the currentRoute, build a stack(list) that will be, 
 * from last to first, route and all parent routes,
 * with the route name and path. 
 * (except the root route)
 */
function buildCurrentRouteStack(route, routingParams, stack){
  let effTargetPath =  getExactPathForRouteWithParams(route.path, routingParams);

  if (effTargetPath !== '/' &&
    effTargetPath !== '') {
    // skip adding root route
    stack.push({
      name: route.name,
      path: effTargetPath,
    });
  }
  if (route.parent) {
    buildCurrentRouteStack(route.parent, routingParams, stack);
  }
}

/**
 * for a route (path) that contains path variables,
 * replace param symbol by actual values
 */
function getExactPathForRouteWithParams(routePath, routingParams){
  let effTargetPath = routePath;
  let paramPatternMatched = routePath.match(/\/:[A-Za-z0-9_]+/g);
  if (paramPatternMatched) {
    for (let matchedPattern of paramPatternMatched) {
      let pathVarValue = routingParams[matchedPattern.substr(2)];
      effTargetPath = effTargetPath.replace(matchedPattern, `/${pathVarValue}`);
    }
  }
  return effTargetPath;
}

export { 
  navigateToIfNeeded,
  buildCurrentRouteStack,
  getExactPathForRouteWithParams,
};
