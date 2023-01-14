import { ComponentClass as CC, FC } from "react";

export namespace N_IMF {
  export type TSubsDetail = {
    to: string,
    name: string,
    icon?: FC,
    hide?: boolean,
  };

  export type TSubs = {
    isMain: string[],
    approvements: TSubsDetail[],
    finances: TSubsDetail[],
  };

  export type TProps = { isExpanded: boolean };
  export type TMenu = { Menu: CC<TProps>, SubMenu: TSubs };

  export type TData = {
    Main: CC<TProps> | FC<TProps>,
    SubMenu: TSubs
  };
}
