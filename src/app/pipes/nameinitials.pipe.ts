import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortname'
})
export class NameinitialsPipe implements PipeTransform {

  transform(name: string): string {
    if (!name) {
      return '';
    }
      const nameSeparate = name.split(' ');
      if (nameSeparate[1][0] && nameSeparate[2][0] )  {
      const newName = `${nameSeparate[0]} ${nameSeparate[1][0]}. ${nameSeparate[2][0]}.`;
    return newName;
  }
  return name;
  }

}
