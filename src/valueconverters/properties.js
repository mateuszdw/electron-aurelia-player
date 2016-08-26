export class FilterOnPropertyValueConverter {
  toView(array, property, exp) {

      if (array === undefined || array === null || property === undefined || exp === undefined) {
          return array;
      }
      return array.filter((item) => {
        exp = RegExp.escape(exp);
        if(exp.length > 0){
          return new RegExp(exp,"gi").test(item[property][0]);
        } else {
          return true;
        }
        // return item[property][0].toLowerCase().indexOf(exp.toLowerCase()) > -1
      });
  }
}

RegExp.escape= function(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

export class HasPropertyValueValueConverter {
  toView(array: {}[], property: string, exp: string) {

      if (array === undefined || array === null || property === undefined || exp === undefined) {
          return false;
      }
      return array.filter((item) => item[property].toLowerCase().indexOf(exp.toLowerCase()) > -1).length > 0;
  }
}
