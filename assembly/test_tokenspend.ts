import { Storage, Context, include_base64, call, print, create_sc } from "massa-sc-std";
import { JSON } from "json-as";
import { MintArgs, TransferArgs, AllowArgs, AllowanceArgs } from "./token";
import { SpendArgs } from "./tokenspender";

const receiver = "YzydYazD1taJFcBQDquuHvv4bdiaaEStK1wCqnLtQkXC9HxkM"
const token1 = "8LaXaAqvzjYNPdpw22RxjAqRZtRD8ReY2bbbqb6mu4R6bphWM";

function createTokenSpender(): string {
    const bytes = include_base64('./build/tokenspender.wasm');
    const tokenSpender = create_sc(bytes);
    print("Created tokenspender at " + tokenSpender);
    return tokenSpender;
}

export function main(_args: string): i32 {
    const addresses = JSON.parse<string[]>(Context.get_call_stack());
    const my_address = addresses[0];
    let bal = call(token1, "balanceOf", my_address, 0);
    print(my_address + " token balance: " + bal);
    call(token1, "transfer", JSON.stringify<TransferArgs>({amount: 100, to: receiver}), 0);
    bal = call(token1, "balanceOf", my_address, 0);
    print(my_address + " token balance: " + bal);
    bal = call(token1, "balanceOf", receiver, 0);
    print(receiver + " token balance: " + bal);
    const tokenSpender = createTokenSpender();
    call(token1, "allow", JSON.stringify<AllowArgs>({amount: 20000, spender: tokenSpender}), 0);
    call(tokenSpender, "spend", JSON.stringify<SpendArgs>({amount: 100, owner: my_address, recipient: receiver, token: token1}), 0);
    bal = call(token1, "balanceOf", receiver, 0);
    print(receiver + " token balance: " + bal);
    return 0;
}
