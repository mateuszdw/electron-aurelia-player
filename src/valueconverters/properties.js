export class FilterOnPropertiesValueConverter {
  toView(array, properties, exp) {

      if (array === undefined || array === null || properties === undefined || exp === undefined) {
          return array;
      }

      return array.filter(item => {
          exp = RegExp.escape(exp);
          if(exp.length > 0){
            // find satisfy regex in every property separate by comma
            return properties.split(',').find(property => {
                return new RegExp(exp,"gi").test(item[property])
            })
          } else {
            // always return all items if item length is not lower then 1
            return true;
          }
      });
  }
}

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};
