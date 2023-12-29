
import { BaseDropdownOption } from '@injectivelabs/ui-shared'

export type Token = Erc20Token | EvmToken | IbcToken | Cw20Token | Cw20TokenSingle | Cw20TokenMultiple | NativeToken | SplToken | FactoryToken;

export interface DropdownOptionWithToken extends BaseDropdownOption {
    token?: Token
}


export * from './enums'
export * from './states'
export * from './authZ'
