import { Pipe, PipeTransform } from '@angular/core';
import { Manager } from './../models/manager.model';
@Pipe({
  name: 'managerfilter'
})
export class ManagerfilterPipe implements PipeTransform {

  transform(manager: Manager[], searchTerm: string): Manager[] {
    if ( !searchTerm ) {
      return manager;
    }
    return manager
      .filter((manager: Manager) =>  `${manager.name}`.toLowerCase().includes(searchTerm.toLowerCase()));
  }
}
