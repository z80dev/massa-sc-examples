import { call } from "massa-sc-std";
import { TransferFromArgs } from "./token";
import { JSON } from "json-as";


@json
export class SpendArgs {
    owner: string = "";
    recipient: string = "";
    token: string = "";
    amount: u32 = 0;
}

export function spend(_args: string): string {
    const args = JSON.parse<SpendArgs>(_args);
    call(args.token, "transferFrom", JSON.stringify<TransferFromArgs>({owner: args.owner, to: args.recipient, amount: args.amount}), 0);
    return "worked";
}
