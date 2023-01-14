import { ComponentClass as CC, FC } from "react";

import { N_IMF } from "./interface";
import { dynamicLoadErrors } from './Errors';
import EmptySection from '../../components/emptySection';

const errHandler: (errText: string, err: any) => void = (errText: string, err: any): void => {
  console.group([dynamicLoadErrors.component, errText, err]);
};

export const dynamicLoad: (menu: () => Promise<any>) => N_IMF.TData = (
  menu: () => Promise<any>
): N_IMF.TData => {

  const _data = {
    Main: EmptySection,
    SubMenu: {}
  } as unknown as N_IMF.TData ;

  menu()
    .then((args: N_IMF.TMenu): Promise<CC<N_IMF.TProps> | FC<N_IMF.TProps> > => {
      if (args.SubMenu) {
        _data.SubMenu = args.SubMenu;
      } else {
        errHandler(dynamicLoadErrors.subMenu, args);
      }

      return args.Menu ? Promise.resolve(args.Menu) : Promise.reject(args);
    })
    .then((element: CC<N_IMF.TProps, any> | FC<N_IMF.TProps>): void => {
      _data.Main = element
    })
    .catch((err: any): void => {
      errHandler(dynamicLoadErrors.name, err);
      _data.Main = EmptySection
    })

  return _data;
}
