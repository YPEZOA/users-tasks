import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'userImage'
})
export class UserImagePipe implements PipeTransform {

  transform(url: string): string {
    return url ? url : '../../../assets/images/default-user.png'
  }

}
